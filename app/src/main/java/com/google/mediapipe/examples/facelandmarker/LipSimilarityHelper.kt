// 입술 랜드마크 좌표 추출
// 모음 6개 판별 (가로폭/세로폭/비율로 계산)

package com.google.mediapipe.examples.facelandmarker

import com.google.mediapipe.tasks.components.containers.NormalizedLandmark
import kotlin.math.sqrt

object LipSimilarityHelper {

    // =============================================
    // 입술 관련 MediaPipe 랜드마크 인덱스 번호
    // MediaPipe는 얼굴에서 478개의 점을 추출하는데
    // 그 중 입술과 관련된 점들의 번호
    // =============================================
    private const val UPPER_LIP = 13      // 윗입술 안쪽 중앙
    private const val LOWER_LIP = 14      // 아랫입술 안쪽 중앙
    private const val LEFT_CORNER = 61    // 왼쪽 입꼬리
    private const val RIGHT_CORNER = 291  // 오른쪽 입꼬리
    private const val UPPER_TOP = 0       // 윗입술 가장 위쪽 (인중 바로 아래)
    private const val LOWER_BOTTOM = 17   // 아랫입술 가장 아래쪽
    private const val NOSE_TIP = 4        // 코끝 (얼굴 크기 기준점)
    private const val CHIN = 152          // 턱 끝 (얼굴 크기 기준점)

    // =============================================
    // 모음 판별 결과를 담는 데이터 클래스
    // =============================================
    data class VowelResult(
        val vowel: String,      // 판별된 모음 ex) "ㅏ"
        val accuracy: Float,    // 해당 모음 정확도 0.0~1.0 ex) 0.72 = 72%
        val lipWidth: Float,    // 입술 가로폭 (얼굴 크기 대비 비율)
        val lipHeight: Float,   // 입술 세로폭 (얼굴 크기 대비 비율)
        val ratio: Float        // 가로폭/세로폭 비율 (클수록 가로로 넓은 입모양)
    )

    // =============================================
    // 선택한 특정 모음 하나의 정확도만 반환
    // CameraFragment에서 선택한 모음(예: ㅏ)의 점수만 필요할 때 사용
    // =============================================
    fun getAccuracyFor(vowel: String, landmarks: List<NormalizedLandmark>): Float {
        if (landmarks.size < 400) return 0f  // 랜드마크가 충분히 감지 안 됐으면 0점

        // 코끝~턱 거리 = 얼굴 크기 기준값 (카메라와의 거리가 달라도 비율은 같음)
        val faceScale = dist(landmarks[NOSE_TIP], landmarks[CHIN])
        if (faceScale < 0.001f) return 0f  // 얼굴이 너무 작게 잡히면 0점

        // 각 측정값을 얼굴 크기로 나눠서 정규화 (거리 무관하게 비율만 사용)
        val lipWidth = dist(landmarks[LEFT_CORNER], landmarks[RIGHT_CORNER]) / faceScale   // 입술 가로폭
        val lipHeight = dist(landmarks[UPPER_TOP], landmarks[LOWER_BOTTOM]) / faceScale    // 입술 세로폭
        val lipOpen = dist(landmarks[UPPER_LIP], landmarks[LOWER_LIP]) / faceScale         // 입 열린 정도
        val ratio = lipWidth / (lipHeight + 0.001f)  // 가로/세로 비율 (0으로 나누기 방지)

        return when (vowel) {
            "ㅏ" -> scoreA(lipWidth, lipHeight, lipOpen, ratio)
            "ㅓ" -> scoreEo(lipWidth, lipHeight, lipOpen, ratio)
            "ㅗ" -> scoreO(lipWidth, lipHeight, lipOpen, ratio)
            "ㅜ" -> scoreU(lipWidth, lipHeight, lipOpen, ratio)
            "ㅡ" -> scoreEu(lipWidth, lipHeight, lipOpen, ratio)
            "ㅣ" -> scoreI(lipWidth, lipHeight, lipOpen, ratio)
            else -> 0f
        }.coerceIn(0f, 1f)  // 결과값을 0~1 사이로 강제 제한
    }

    // =============================================
    // 6개 모음 중 가장 점수 높은 모음 자동 판별
    // =============================================
    fun analyze(landmarks: List<NormalizedLandmark>): VowelResult? {
        if (landmarks.size < 400) return null

        val faceScale = dist(landmarks[NOSE_TIP], landmarks[CHIN])
        if (faceScale < 0.001f) return null

        val lipWidth = dist(landmarks[LEFT_CORNER], landmarks[RIGHT_CORNER]) / faceScale
        val lipHeight = dist(landmarks[UPPER_TOP], landmarks[LOWER_BOTTOM]) / faceScale
        val lipOpen = dist(landmarks[UPPER_LIP], landmarks[LOWER_LIP]) / faceScale
        val ratio = lipWidth / (lipHeight + 0.001f)

        return classifyVowel(lipWidth, lipHeight, lipOpen, ratio)
    }

    // =============================================
    // 6개 모음 전부 점수 계산 후 가장 높은 모음 반환
    // =============================================
    private fun classifyVowel(width: Float, height: Float, open: Float, ratio: Float): VowelResult {
        val scores = mapOf(
            "ㅏ" to scoreA(width, height, open, ratio),
            "ㅓ" to scoreEo(width, height, open, ratio),
            "ㅗ" to scoreO(width, height, open, ratio),
            "ㅜ" to scoreU(width, height, open, ratio),
            "ㅡ" to scoreEu(width, height, open, ratio),
            "ㅣ" to scoreI(width, height, open, ratio)
        )
        val best = scores.maxByOrNull { it.value }!!  // 가장 점수 높은 모음 선택
        return VowelResult(
            vowel = best.key,
            accuracy = best.value.coerceIn(0f, 1f),
            lipWidth = width,
            lipHeight = height,
            ratio = ratio
        )
    }

    // =============================================
    // 각 모음별 점수 계산 함수
    //
    // [gaussian 함수 설명]
    // center = 이 모음의 이상적인 기준값
    // sigma = 허용 범위 (클수록 기준에서 멀어도 점수 높게 나옴 = 판정 완화)
    // center에 가까울수록 1.0, 멀수록 0에 가까운 점수 반환
    //
    // [가중치 설명]
    // openScore * 0.6 = 입 열린 정도가 60% 비중
    // ratioScore * 0.4 = 가로세로 비율이 40% 비중
    // =============================================

    // ㅏ: 입을 세로로 크게 벌림
    // open이 크고(0.18), ratio는 중간(2.0)
    private fun scoreA(w: Float, h: Float, open: Float, ratio: Float): Float {
        val openScore = gaussian(open, center = 0.18f, sigma = 0.12f)   // 입 열린 정도
        val ratioScore = gaussian(ratio, center = 2.0f, sigma = 1.05f)  // 가로세로 비율
        return (openScore * 0.6f + ratioScore * 0.4f)
    }

    // ㅓ: 입을 중간 정도 벌림, ㅏ보다 가로가 좁음
    // open 중간(0.13), ratio ㅏ보다 작음(1.6)
    private fun scoreEo(w: Float, h: Float, open: Float, ratio: Float): Float {
        val openScore = gaussian(open, center = 0.13f, sigma = 0.10f)
        val ratioScore = gaussian(ratio, center = 1.6f, sigma = 0.8f)
        return (openScore * 0.6f + ratioScore * 0.4f)
    }

    // ㅗ: 입술 동그랗게 모음, 가로폭 좁음
    // open 작음(0.10), ratio 작음(1.2), width 좁음(0.20)
    private fun scoreO(w: Float, h: Float, open: Float, ratio: Float): Float {
        val openScore = gaussian(open, center = 0.10f, sigma = 0.08f)
        val ratioScore = gaussian(ratio, center = 1.2f, sigma = 0.6f)
        val widthScore = gaussian(w, center = 0.20f, sigma = 0.10f)  // 가로폭도 추가 체크
        return (openScore * 0.4f + ratioScore * 0.4f + widthScore * 0.2f)
    }

    // ㅜ: ㅗ보다 더 좁고 입술 앞으로 내밈
    // open 매우 작음(0.07), ratio 매우 작음(0.9), width 매우 좁음(0.16)
    private fun scoreU(w: Float, h: Float, open: Float, ratio: Float): Float {
        val openScore = gaussian(open, center = 0.07f, sigma = 0.06f)
        val ratioScore = gaussian(ratio, center = 0.9f, sigma = 0.5f)
        val widthScore = gaussian(w, center = 0.16f, sigma = 0.08f)
        return (openScore * 0.4f + ratioScore * 0.4f + widthScore * 0.2f)
    }

    // ㅡ: 입을 가로로 길게, 세로는 최소
    // open 거의 0(0.03), ratio 매우 큼(3.5)
    private fun scoreEu(w: Float, h: Float, open: Float, ratio: Float): Float {
        val openScore = gaussian(open, center = 0.03f, sigma = 0.04f)
        val ratioScore = gaussian(ratio, center = 3.5f, sigma = 1.2f)
        return (openScore * 0.5f + ratioScore * 0.5f)
    }

    // ㅣ: 입꼬리 양옆으로 최대, 세로 좁음
    // open 작음(0.05), ratio 최대(4.0), width 최대(0.32)
    private fun scoreI(w: Float, h: Float, open: Float, ratio: Float): Float {
        val openScore = gaussian(open, center = 0.05f, sigma = 0.06f)
        val ratioScore = gaussian(ratio, center = 4.0f, sigma = 1.4f)
        val widthScore = gaussian(w, center = 0.32f, sigma = 0.10f)
        return (openScore * 0.3f + ratioScore * 0.4f + widthScore * 0.3f)
    }

    // =============================================
    // 가우시안 함수
    // value가 center에 가까울수록 1.0 반환
    // sigma가 클수록 center에서 멀어도 점수가 덜 떨어짐 (판정 완화)
    // =============================================
    private fun gaussian(value: Float, center: Float, sigma: Float): Float {
        val diff = value - center
        return kotlin.math.exp(-(diff * diff) / (2 * sigma * sigma)).toFloat()
    }

    // =============================================
    // 두 랜드마크 점 사이의 거리 계산 (피타고라스)
    // =============================================
    private fun dist(a: NormalizedLandmark, b: NormalizedLandmark): Float {
        val dx = a.x() - b.x()
        val dy = a.y() - b.y()
        return sqrt(dx * dx + dy * dy)
    }
}