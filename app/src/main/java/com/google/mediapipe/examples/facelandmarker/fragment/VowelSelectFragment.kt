// 모음 선택 화면
// ㅏ, ㅓ, ㅗ, ㅜ, ㅡ, ㅣ 버튼 6개
// 선택하면 CameraFragment로 이동 -> 선택 모음 전달

package com.google.mediapipe.examples.facelandmarker.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.os.bundleOf
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.google.mediapipe.examples.facelandmarker.R
import com.google.mediapipe.examples.facelandmarker.databinding.FragmentVowelSelectBinding

class VowelSelectFragment : Fragment() {

    private var _binding: FragmentVowelSelectBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentVowelSelectBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val vowels = mapOf(
            binding.btnVowelA to "ㅏ",
            binding.btnVowelEo to "ㅓ",
            binding.btnVowelO to "ㅗ",
            binding.btnVowelU to "ㅜ",
            binding.btnVowelEu to "ㅡ",
            binding.btnVowelI to "ㅣ"
        )

        vowels.forEach { (button, vowel) ->
            button.setOnClickListener {
                findNavController().navigate(
                    R.id.camera_fragment,
                    bundleOf("selectedVowel" to vowel)
                )
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}