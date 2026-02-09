import type { DetectedFace } from '@/features/search-profile';
import { useCallback, useRef, useState } from 'react';
import {
  FaceBboxLabel,
  FaceBoundingBox,
  FaceCard,
  FaceCheckMark,
  FaceGrid,
  FaceGridLabel,
  FacePreviewImage,
  FacePreviewWrapper,
  ModalCancelBtn,
  ModalConfirmBtn,
  ModalContent,
  ModalDesc,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
} from './ComprehensiveAnalyzePage.styles';

interface FaceSelectModalProps {
  faces: DetectedFace[];
  selectedIndex: number | null;
  previewUrl: string | null;
  onSelect: (index: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function FaceSelectModal({
  faces,
  selectedIndex,
  previewUrl,
  onSelect,
  onConfirm,
  onCancel,
}: FaceSelectModalProps) {
  const previewImgRef = useRef<HTMLImageElement>(null);
  const [imgNaturalSize, setImgNaturalSize] = useState<{ w: number; h: number } | null>(null);

  const handlePreviewLoad = useCallback(() => {
    const img = previewImgRef.current;
    if (img) {
      setImgNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    }
  }, []);

  return (
    <ModalOverlay onClick={onConfirm}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>검색할 얼굴을 선택하세요</ModalTitle>
          <ModalDesc>{faces.length}개의 얼굴이 감지되었습니다</ModalDesc>
        </ModalHeader>

        {previewUrl && (
          <FacePreviewWrapper>
            <FacePreviewImage
              ref={previewImgRef}
              src={previewUrl}
              alt="업로드 이미지"
              onLoad={handlePreviewLoad}
            />
            {imgNaturalSize &&
              faces.map((face) => {
                const { x, y, w, h } = face.facialArea;
                const pctLeft = (x / imgNaturalSize.w) * 100;
                const pctTop = (y / imgNaturalSize.h) * 100;
                const pctW = (w / imgNaturalSize.w) * 100;
                const pctH = (h / imgNaturalSize.h) * 100;
                const isSelected = selectedIndex === face.index;

                return (
                  <FaceBoundingBox
                    key={face.index}
                    $selected={isSelected}
                    onClick={() => onSelect(face.index)}
                    style={{
                      left: `${pctLeft}%`,
                      top: `${pctTop}%`,
                      width: `${pctW}%`,
                      height: `${pctH}%`,
                    }}
                  >
                    <FaceBboxLabel $selected={isSelected}>{face.index + 1}</FaceBboxLabel>
                  </FaceBoundingBox>
                );
              })}
          </FacePreviewWrapper>
        )}

        <FaceGridLabel>감지된 얼굴</FaceGridLabel>
        <FaceGrid>
          {faces.map((face) => (
            <FaceCard
              key={face.index}
              $selected={selectedIndex === face.index}
              onClick={() => onSelect(face.index)}
            >
              <img
                src={`data:image/jpeg;base64,${face.imageBase64}`}
                alt={`얼굴 ${face.index + 1}`}
              />
              {selectedIndex === face.index && (
                <FaceCheckMark>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="3"
                    role="img"
                    aria-label="선택됨"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </FaceCheckMark>
              )}
            </FaceCard>
          ))}
        </FaceGrid>

        <ModalFooter>
          <ModalCancelBtn onClick={onCancel}>선택 안 함</ModalCancelBtn>
          <ModalConfirmBtn
            $disabled={selectedIndex === null}
            disabled={selectedIndex === null}
            onClick={onConfirm}
          >
            선택 완료
          </ModalConfirmBtn>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
}
