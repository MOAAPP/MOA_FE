// 카메라 제어
// 카메라 실행 및 MediaPipe 연결
// 매 프레임마다 LipSimilarityHelper.analyze() 호출
// 결과 -> OverlayView에 전달

package com.google.mediapipe.examples.facelandmarker.fragment

import android.annotation.SuppressLint
import android.content.res.Configuration
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.camera.core.Preview
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageProxy
import androidx.camera.core.Camera
import androidx.camera.core.AspectRatio
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.navigation.Navigation
import androidx.viewpager2.widget.ViewPager2.SCROLL_STATE_DRAGGING
import com.google.mediapipe.examples.facelandmarker.FaceLandmarkerHelper
import com.google.mediapipe.examples.facelandmarker.LipSimilarityHelper
import com.google.mediapipe.examples.facelandmarker.MainViewModel
import com.google.mediapipe.examples.facelandmarker.R
import com.google.mediapipe.examples.facelandmarker.databinding.FragmentCameraBinding
import com.google.mediapipe.tasks.vision.core.RunningMode
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit

class CameraFragment : Fragment(), FaceLandmarkerHelper.LandmarkerListener {

    companion object {
        private const val TAG = "Face Landmarker"
        private const val CAMERA_ZOOM_RATIO = 2.5f  // 카메라 줌 배율 (높을수록 확대)
    }

    private var _fragmentCameraBinding: FragmentCameraBinding? = null
    private val fragmentCameraBinding get() = _fragmentCameraBinding!!

    private lateinit var faceLandmarkerHelper: FaceLandmarkerHelper
    private val viewModel: MainViewModel by activityViewModels()

    private var preview: Preview? = null
    private var imageAnalyzer: ImageAnalysis? = null
    private var camera: Camera? = null
    private var cameraProvider: ProcessCameraProvider? = null
    private var cameraFacing = CameraSelector.LENS_FACING_FRONT  // 기본값: 전면 카메라

    private lateinit var backgroundExecutor: ExecutorService

    // 마지막으로 감지된 랜드마크 (버튼 클릭 시 사용 가능)
    private var lastLandmarks: List<com.google.mediapipe.tasks.components.containers.NormalizedLandmark>? = null

    // VowelSelectFragment에서 선택한 모음 (기본값: ㅏ)
    private var selectedVowel: String = "ㅏ"

    // =============================================
    // 앱이 포그라운드로 돌아올 때 호출
    // 권한 확인 + FaceLandmarker 재시작
    // =============================================
    override fun onResume() {
        super.onResume()
        if (!PermissionsFragment.hasPermissions(requireContext())) {
            Navigation.findNavController(
                requireActivity(), R.id.fragment_container
            ).navigate(R.id.action_camera_to_permissions)
        }
        backgroundExecutor.execute {
            if (faceLandmarkerHelper.isClose()) {
                faceLandmarkerHelper.setupFaceLandmarker()
            }
        }
    }

    // =============================================
    // 앱이 백그라운드로 갈 때 호출
    // 설정값 저장 + FaceLandmarker 종료
    // =============================================
    override fun onPause() {
        super.onPause()
        if (this::faceLandmarkerHelper.isInitialized) {
            viewModel.setMaxFaces(faceLandmarkerHelper.maxNumFaces)
            viewModel.setMinFaceDetectionConfidence(faceLandmarkerHelper.minFaceDetectionConfidence)
            viewModel.setMinFaceTrackingConfidence(faceLandmarkerHelper.minFaceTrackingConfidence)
            viewModel.setMinFacePresenceConfidence(faceLandmarkerHelper.minFacePresenceConfidence)
            viewModel.setDelegate(faceLandmarkerHelper.currentDelegate)
            backgroundExecutor.execute { faceLandmarkerHelper.clearFaceLandmarker() }
        }
    }

    // =============================================
    // 화면이 종료될 때 호출
    // 바인딩 해제 + 백그라운드 스레드 종료
    // =============================================
    override fun onDestroyView() {
        _fragmentCameraBinding = null
        super.onDestroyView()
        backgroundExecutor.shutdown()
        backgroundExecutor.awaitTermination(Long.MAX_VALUE, TimeUnit.NANOSECONDS)
    }

    // =============================================
    // 화면 레이아웃 생성
    // =============================================
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _fragmentCameraBinding = FragmentCameraBinding.inflate(inflater, container, false)
        return fragmentCameraBinding.root
    }

    // =============================================
    // 화면이 생성된 후 초기화
    // - VowelSelectFragment에서 선택한 모음 받기
    // - 카메라 세팅
    // - FaceLandmarker 초기화
    // =============================================
    @SuppressLint("MissingPermission")
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // VowelSelectFragment에서 전달받은 모음 (ex: "ㅏ")
        selectedVowel = arguments?.getString("selectedVowel") ?: "ㅏ"

        // 백그라운드 스레드 생성 (ML 연산용)
        backgroundExecutor = Executors.newSingleThreadExecutor()

        // 카메라 뷰가 준비된 후 카메라 세팅
        fragmentCameraBinding.viewFinder.post {
            setUpCamera()
        }

        // 백그라운드에서 FaceLandmarker 초기화
        backgroundExecutor.execute {
            faceLandmarkerHelper = FaceLandmarkerHelper(
                context = requireContext(),
                runningMode = RunningMode.LIVE_STREAM,
                minFaceDetectionConfidence = viewModel.currentMinFaceDetectionConfidence,
                minFaceTrackingConfidence = viewModel.currentMinFaceTrackingConfidence,
                minFacePresenceConfidence = viewModel.currentMinFacePresenceConfidence,
                maxNumFaces = viewModel.currentMaxFaces,
                currentDelegate = viewModel.currentDelegate,
                faceLandmarkerHelperListener = this
            )
        }
    }

    // =============================================
    // CameraX 초기화
    // 카메라 프로바이더 가져온 후 바인딩
    // =============================================
    private fun setUpCamera() {
        val cameraProviderFuture = ProcessCameraProvider.getInstance(requireContext())
        cameraProviderFuture.addListener({
            cameraProvider = cameraProviderFuture.get()
            bindCameraUseCases()
        }, ContextCompat.getMainExecutor(requireContext()))
    }

    // =============================================
    // 카메라 프리뷰 + 이미지 분석 바인딩
    // - 전면 카메라 선택
    // - 줌인 설정 (CAMERA_ZOOM_RATIO)
    // - 매 프레임마다 detectFace() 호출
    // =============================================
    @SuppressLint("UnsafeOptInUsageError")
    private fun bindCameraUseCases() {
        val cameraProvider = cameraProvider
            ?: throw IllegalStateException("Camera initialization failed.")

        val cameraSelector = CameraSelector.Builder().requireLensFacing(cameraFacing).build()

        // 프리뷰 설정
        preview = Preview.Builder()
            .setTargetAspectRatio(AspectRatio.RATIO_4_3)
            .setTargetRotation(fragmentCameraBinding.viewFinder.display.rotation)
            .build()

        // 이미지 분석 설정 (매 프레임 MediaPipe로 전달)
        imageAnalyzer = ImageAnalysis.Builder()
            .setTargetAspectRatio(AspectRatio.RATIO_4_3)
            .setTargetRotation(fragmentCameraBinding.viewFinder.display.rotation)
            .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
            .setOutputImageFormat(ImageAnalysis.OUTPUT_IMAGE_FORMAT_RGBA_8888)
            .build()
            .also {
                it.setAnalyzer(backgroundExecutor) { image -> detectFace(image) }
            }

        cameraProvider.unbindAll()

        try {
            camera = cameraProvider.bindToLifecycle(this, cameraSelector, preview, imageAnalyzer)
            preview?.setSurfaceProvider(fragmentCameraBinding.viewFinder.surfaceProvider)

            // 카메라 줌인 (입술 부분이 잘 보이도록)
            // CAMERA_ZOOM_RATIO 값 조절로 확대 배율 변경 가능
            camera?.cameraControl?.setZoomRatio(CAMERA_ZOOM_RATIO)

        } catch (exc: Exception) {
            Log.e(TAG, "Use case binding failed", exc)
        }
    }

    // =============================================
    // 매 프레임을 FaceLandmarkerHelper로 전달
    // =============================================
    private fun detectFace(imageProxy: ImageProxy) {
        faceLandmarkerHelper.detectLiveStream(
            imageProxy = imageProxy,
            isFrontCamera = cameraFacing == CameraSelector.LENS_FACING_FRONT
        )
    }

    // =============================================
    // 화면 회전 시 이미지 분석기 회전 업데이트
    // =============================================
    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        imageAnalyzer?.targetRotation = fragmentCameraBinding.viewFinder.display.rotation
    }

    // =============================================
    // 얼굴 랜드마크 감지 결과 수신
    // - 입술 좌표 추출
    // - 선택한 모음의 정확도 계산
    // - OverlayView에 결과 전달해서 화면에 표시
    // =============================================
    override fun onResults(resultBundle: FaceLandmarkerHelper.ResultBundle) {
        activity?.runOnUiThread {
            if (_fragmentCameraBinding != null) {
                val landmarks = resultBundle.result.faceLandmarks()
                if (landmarks.isNotEmpty()) {
                    lastLandmarks = landmarks[0]

                    // 6개 모음 중 현재 입모양이 어떤 모음인지 분석
                    val result = LipSimilarityHelper.analyze(landmarks[0])
                    if (result != null) {
                        // 선택한 모음(ex: ㅏ)에 대한 정확도만 계산
                        val targetAccuracy = LipSimilarityHelper.getAccuracyFor(selectedVowel, landmarks[0])
                        fragmentCameraBinding.overlay.updateVowelResult(
                            result.copy(vowel = selectedVowel, accuracy = targetAccuracy)
                        )
                    }
                }

                // OverlayView에 랜드마크 전달 (화면에 점/선 그리기)
                fragmentCameraBinding.overlay.setResults(
                    resultBundle.result,
                    resultBundle.inputImageHeight,
                    resultBundle.inputImageWidth,
                    RunningMode.LIVE_STREAM
                )
                fragmentCameraBinding.overlay.invalidate()
            }
        }
    }

    // =============================================
    // 얼굴 감지 안 될 때 호출
    // OverlayView 초기화
    // =============================================
    override fun onEmpty() {
        fragmentCameraBinding.overlay.clear()
    }

    // =============================================
    // 오류 발생 시 호출
    // =============================================
    override fun onError(error: String, errorCode: Int) {
        activity?.runOnUiThread {
            Toast.makeText(requireContext(), error, Toast.LENGTH_SHORT).show()
        }
    }
}