// OverlayView
// 카메라 화면 위에 그림 그리기
// - 얼굴 랜드마크 점/선 표시
// - 입술 부분만 초록색으로 강조
// - 모음 정확도 % 텍스트 표시


package com.google.mediapipe.examples.facelandmarker

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.util.AttributeSet
import android.view.View
import androidx.core.content.ContextCompat
import com.google.mediapipe.tasks.components.containers.NormalizedLandmark
import com.google.mediapipe.tasks.vision.core.RunningMode
import com.google.mediapipe.tasks.vision.facelandmarker.FaceLandmarker
import com.google.mediapipe.tasks.vision.facelandmarker.FaceLandmarkerResult
import kotlin.math.max
import kotlin.math.min

class OverlayView(context: Context?, attrs: AttributeSet?) : View(context, attrs) {

    private var results: FaceLandmarkerResult? = null
    private var linePaint = Paint()   // 랜드마크 연결선용 페인트
    private var pointPaint = Paint()  // 일반 랜드마크 점용 페인트
    private var lipPaint = Paint()    // 입술 랜드마크 강조용 페인트 (초록색)
    private var vowelResult: LipSimilarityHelper.VowelResult? = null  // 모음 판별 결과

    private var scaleFactor: Float = 1f   // 이미지 → 화면 스케일 비율
    private var imageWidth: Int = 1
    private var imageHeight: Int = 1

    init {
        initPaints()
    }

    // =============================================
    // 외부에서 모음 판별 결과 업데이트
    // CameraFragment의 onResults()에서 호출
    // =============================================
    fun updateVowelResult(result: LipSimilarityHelper.VowelResult) {
        vowelResult = result
    }

    // =============================================
    // 화면 초기화 (얼굴 감지 안 될 때 호출)
    // =============================================
    fun clear() {
        results = null
        vowelResult = null
        linePaint.reset()
        pointPaint.reset()
        lipPaint.reset()
        invalidate()
        initPaints()
    }

    // =============================================
    // 페인트 초기화
    // =============================================
    private fun initPaints() {
        // 랜드마크 연결선 (파란색 계열)
        linePaint.color = ContextCompat.getColor(context!!, R.color.mp_color_primary)
        linePaint.strokeWidth = LANDMARK_STROKE_WIDTH
        linePaint.style = Paint.Style.STROKE

        // 일반 랜드마크 점 (노란색)
        pointPaint.color = Color.YELLOW
        pointPaint.strokeWidth = LANDMARK_STROKE_WIDTH
        pointPaint.style = Paint.Style.FILL

        // 입술 랜드마크 점 (초록색, 더 크게)
        lipPaint.color = Color.GREEN
        lipPaint.strokeWidth = LANDMARK_STROKE_WIDTH * 1.5f
        lipPaint.style = Paint.Style.FILL
    }

    // =============================================
    // 매 프레임 화면 그리기
    // 1. 모음 + 정확도 텍스트 표시
    // 2. 입술 랜드마크 점 그리기
    // 3. 얼굴 연결선 그리기
    // =============================================
    override fun draw(canvas: Canvas) {
        super.draw(canvas)

        // 모음 판별 결과 텍스트 표시 (그냥 확인용)
        // 정확도에 따라 색상 변경 (초록/노랑/빨강)
        vowelResult?.let { result ->
            val color = when {
                result.accuracy > 0.7f -> Color.GREEN   // 70% 이상: 초록
                result.accuracy > 0.4f -> Color.YELLOW  // 40% 이상: 노랑
                else -> Color.RED                        // 40% 미만: 빨강
            }
            val scorePaint = Paint().apply {
                this.color = color
                textSize = 90f
                isFakeBoldText = true
            }
            val subPaint = Paint().apply {
                this.color = Color.WHITE
                textSize = 50f
            }
            // 모음 + 정확도 표시 ex) "ㅏ  72%"
            canvas.drawText(
                "${result.vowel}  ${(result.accuracy * 100).toInt()}%",
                50f, 300f, scorePaint
            )
            // 디버그용 수치 표시 (나중에 제거 가능)
            canvas.drawText(
                "가로: ${"%.2f".format(result.lipWidth)}  세로: ${"%.2f".format(result.lipHeight)}  비율: ${"%.2f".format(result.ratio)}",
                50f, 380f, subPaint
            )
        }

        if (results?.faceLandmarks().isNullOrEmpty()) {
            clear()
            return
        }

        results?.let { faceLandmarkerResult ->
            val scaledImageWidth = imageWidth * scaleFactor
            val scaledImageHeight = imageHeight * scaleFactor
            val offsetX = (width - scaledImageWidth) / 2f
            val offsetY = (height - scaledImageHeight) / 2f

            faceLandmarkerResult.faceLandmarks().forEach { faceLandmarks ->
                drawFaceLandmarks(canvas, faceLandmarks, offsetX, offsetY)
                drawFaceConnectors(canvas, faceLandmarks, offsetX, offsetY)
            }
        }
    }

    // =============================================
    // 랜드마크 점 그리기
    // 입술 인덱스(LIP_INDICES_SET)에 해당하면 초록색 원
    // 나머지는 노란색 점
    // =============================================
    private fun drawFaceLandmarks(
        canvas: Canvas,
        faceLandmarks: List<NormalizedLandmark>,
        offsetX: Float,
        offsetY: Float
    ) {
        faceLandmarks.forEachIndexed { index, landmark ->
            val x = landmark.x() * imageWidth * scaleFactor + offsetX
            val y = landmark.y() * imageHeight * scaleFactor + offsetY
            if (index in LIP_INDICES_SET) {
                canvas.drawCircle(x, y, 6f, lipPaint)  // 입술: 초록 원
            } else {
                canvas.drawPoint(x, y, pointPaint)      // 나머지: 노란 점
            }
        }
    }

    // =============================================
    // 랜드마크 연결선 그리기
    // MediaPipe가 제공하는 FACE_LANDMARKS_CONNECTORS 사용
    // =============================================
    private fun drawFaceConnectors(
        canvas: Canvas,
        faceLandmarks: List<NormalizedLandmark>,
        offsetX: Float,
        offsetY: Float
    ) {
        FaceLandmarker.FACE_LANDMARKS_CONNECTORS.filterNotNull().forEach { connector ->
            val startLandmark = faceLandmarks.getOrNull(connector.start())
            val endLandmark = faceLandmarks.getOrNull(connector.end())
            if (startLandmark != null && endLandmark != null) {
                val startX = startLandmark.x() * imageWidth * scaleFactor + offsetX
                val startY = startLandmark.y() * imageHeight * scaleFactor + offsetY
                val endX = endLandmark.x() * imageWidth * scaleFactor + offsetX
                val endY = endLandmark.y() * imageHeight * scaleFactor + offsetY
                canvas.drawLine(startX, startY, endX, endY, linePaint)
            }
        }
    }

    // =============================================
    // 외부에서 랜드마크 결과 전달
    // CameraFragment의 onResults()에서 호출
    // scaleFactor: 이미지 크기 → 화면 크기 변환 비율
    // =============================================
    fun setResults(
        faceLandmarkerResults: FaceLandmarkerResult,
        imageHeight: Int,
        imageWidth: Int,
        runningMode: RunningMode = RunningMode.IMAGE
    ) {
        results = faceLandmarkerResults
        this.imageHeight = imageHeight
        this.imageWidth = imageWidth
        scaleFactor = when (runningMode) {
            RunningMode.IMAGE,
            RunningMode.VIDEO -> min(width * 1f / imageWidth, height * 1f / imageHeight)
            RunningMode.LIVE_STREAM -> max(width * 1f / imageWidth, height * 1f / imageHeight)
        }
        invalidate()
    }

    companion object {
        private const val LANDMARK_STROKE_WIDTH = 8F
        private const val TAG = "Face Landmarker Overlay"

        // 입술에 해당하는 MediaPipe 랜드마크 인덱스 번호 목록
        // 이 인덱스에 해당하는 점만 초록색으로 강조 표시
        private val LIP_INDICES_SET = setOf(
            61, 185, 40, 39, 37, 0, 267, 269, 270, 409,
            291, 146, 91, 181, 84, 17, 314, 405, 321, 375,
            78, 191, 80, 81, 82, 13, 312, 311, 310, 415,
            308, 324, 318, 402, 317, 14, 87, 178, 88, 95
        )
    }
}