import { useState, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import styled from '@emotion/styled';
import { PageLayout, ImageDropzone } from '@/shared/ui';
import { useProfileSearch, useFaceDetect, type DetectedFace } from '@/features/search-profile';
import { memoryStore } from '@/shared/lib/storage';

const ContentWrapper = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px 0;
`;

const DropzoneWrapper = styled.div`
  margin-bottom: 20px;
`;


const Button = styled.button`
  width: 100%;
  padding: 16px;
  background: var(--accent-gradient);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  &:active {
    opacity: 0.9;
  }

  &:disabled {
    background: var(--border-color);
    color: var(--text-tertiary);
  }
`;


const TipCard = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: var(--bg-card);
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
`;

const TipTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
`;

const TipList = styled.ul`
  margin: 0;
  padding: 0 0 0 20px;
`;

const TipItem = styled.li`
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.8;
`;

const ErrorMessage = styled.div`
  padding: 16px;
  background: #ffebee;
  border-radius: 12px;
  color: #f04452;
  font-size: 14px;
  margin-top: 16px;
  text-align: center;
`;

// ========== Face Select Modal ==========

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const ModalContent = styled.div`
  background: var(--bg-card);
  border-radius: 16px;
  max-width: 420px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  padding: 20px 20px 12px;
  border-bottom: 1px solid var(--border-color);
`;

const ModalTitle = styled.h3`
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px;
`;

const ModalDesc = styled.p`
  font-size: 13px;
  color: var(--text-tertiary);
  margin: 0;
`;

const FacePreviewWrapper = styled.div`
  position: relative;
  margin: 16px 20px 0;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
`;

const FacePreviewImage = styled.img`
  width: 100%;
  display: block;
`;

const FaceBoundingBox = styled.div<{ $selected: boolean }>`
  position: absolute;
  border: 2px solid ${p => (p.$selected ? '#6366f1' : 'rgba(255, 255, 255, 0.7)')};
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-shadow: ${p => (p.$selected ? '0 0 0 2px rgba(99,102,241,0.4)' : 'none')};

  &:hover {
    border-color: #6366f1;
  }
`;

const FaceBboxLabel = styled.div<{ $selected: boolean }>`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  background: ${p => (p.$selected ? '#6366f1' : 'rgba(0,0,0,0.6)')};
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
`;

const FaceGridLabel = styled.div`
  padding: 12px 20px 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
`;

const FaceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
  padding: 10px 20px 16px;
`;

const FaceCard = styled.button<{ $selected: boolean }>`
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  border: 3px solid ${p => (p.$selected ? '#6366f1' : 'var(--border-color)')};
  background: var(--bg-secondary);
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  transition: border-color 0.2s, transform 0.15s;

  &:hover { transform: scale(1.04); }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const FaceCheckMark = styled.div`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #6366f1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalFooter = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 20px 20px;
  border-top: 1px solid var(--border-color);
`;

const ModalCancelBtn = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const ModalConfirmBtn = styled.button<{ $disabled?: boolean }>`
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: ${p => (p.$disabled ? 'var(--bg-secondary)' : '#6366f1')};
  color: ${p => (p.$disabled ? 'var(--text-tertiary)' : '#fff')};
  font-size: 14px;
  font-weight: 600;
  cursor: ${p => (p.$disabled ? 'default' : 'pointer')};
`;

const DetectingText = styled.div`
  padding: 12px;
  text-align: center;
  color: var(--text-tertiary);
  font-size: 13px;
  margin-bottom: 12px;
`;


export default function ProfileSearchPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 얼굴 감지/선택
  const [detectedFaces, setDetectedFaces] = useState<DetectedFace[]>([]);
  const [selectedFaceIndex, setSelectedFaceIndex] = useState<number | null>(null);
  const [showFaceModal, setShowFaceModal] = useState(false);
  const [imgNaturalSize, setImgNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const previewImgRef = useRef<HTMLImageElement>(null);

  const profileSearch = useProfileSearch();
  const faceDetect = useFaceDetect();

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  const handlePreviewLoad = useCallback(() => {
    const img = previewImgRef.current;
    if (img) {
      setImgNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    }
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setDetectedFaces([]);
    setSelectedFaceIndex(null);

    // 이미지인 경우 얼굴 감지 실행
    if (selectedFile.type.startsWith('image/')) {
      faceDetect.mutate(selectedFile, {
        onSuccess: (faces) => {
          if (faces.length > 0) {
            setDetectedFaces(faces);
            setShowFaceModal(true);
          }
        },
      });
    }
  };

  const canSearch = !!file;

  const search = async () => {
    if (!canSearch) return;
    setError(null);

    try {
      // 항상 원본 이미지로 검색 (크롭하면 역이미지 검색 결과가 나빠짐)

      // 업로드한 이미지를 먼저 base64로 변환하여 세션에 저장
      if (file) {
        await new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            memoryStore.set('profileSearchImage', reader.result as string);
            resolve();
          };
          reader.readAsDataURL(file);
        });
      }

      const data = await profileSearch.mutateAsync({
        image: file || undefined,
      });

      // 결과를 세션에 저장하고 결과 페이지로 이동
      memoryStore.set('profileSearchResult', {
        ...data,
        searchedAt: new Date().toISOString(),
      });
      navigate({ to: '/profile-search/result' });
    } catch (err) {
      setError(err instanceof Error ? err.message : '서버에 연결할 수 없습니다');
    }
  };


  return (
    <PageLayout title="프로필 검색">
      <ContentWrapper>
        <DropzoneWrapper>
          <ImageDropzone
            onFileSelect={handleFileSelect}
            accept="image"
            title=""
            hint=""
            maxSizeMB={2}
            icon={
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            }
          />
        </DropzoneWrapper>

        {faceDetect.isPending && (
          <DetectingText>얼굴을 감지하고 있습니다...</DetectingText>
        )}

        <Button onClick={search} disabled={!canSearch || profileSearch.isPending}>
          {profileSearch.isPending ? '검색 중...' : '프로필 검색'}
        </Button>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <TipCard>
          <TipTitle>이렇게 사용하세요</TipTitle>
          <TipList>
            <TipItem>상대방의 프로필 사진을 캡처해서 업로드하세요</TipItem>
            <TipItem>AI가 사기꾼 DB와 비교하고 역이미지 검색을 수행합니다</TipItem>
            <TipItem>의심되는 프로필은 신고하여 다른 피해를 예방하세요</TipItem>
          </TipList>
        </TipCard>
      </ContentWrapper>

      {/* Face Select Modal */}
      {showFaceModal && detectedFaces.length > 0 && (
        <ModalOverlay onClick={() => setShowFaceModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>검색할 얼굴을 선택하세요</ModalTitle>
              <ModalDesc>
                {detectedFaces.length}개의 얼굴이 감지되었습니다
              </ModalDesc>
            </ModalHeader>

            {/* 원본 이미지 + 얼굴 바운딩 박스 */}
            {previewUrl && (
              <FacePreviewWrapper>
                <FacePreviewImage
                  ref={previewImgRef}
                  src={previewUrl}
                  alt="업로드 이미지"
                  onLoad={handlePreviewLoad}
                />
                {imgNaturalSize && detectedFaces.map((face) => {
                  const { x, y, w, h } = face.facialArea;
                  const pctLeft = (x / imgNaturalSize.w) * 100;
                  const pctTop = (y / imgNaturalSize.h) * 100;
                  const pctW = (w / imgNaturalSize.w) * 100;
                  const pctH = (h / imgNaturalSize.h) * 100;
                  const isSelected = selectedFaceIndex === face.index;

                  return (
                    <FaceBoundingBox
                      key={face.index}
                      $selected={isSelected}
                      onClick={() => setSelectedFaceIndex(face.index)}
                      style={{
                        left: `${pctLeft}%`,
                        top: `${pctTop}%`,
                        width: `${pctW}%`,
                        height: `${pctH}%`,
                      }}
                    >
                      <FaceBboxLabel $selected={isSelected}>
                        {face.index + 1}
                      </FaceBboxLabel>
                    </FaceBoundingBox>
                  );
                })}
              </FacePreviewWrapper>
            )}

            {/* 크롭된 얼굴 그리드 */}
            <FaceGridLabel>감지된 얼굴</FaceGridLabel>
            <FaceGrid>
              {detectedFaces.map((face) => (
                <FaceCard
                  key={face.index}
                  $selected={selectedFaceIndex === face.index}
                  onClick={() => setSelectedFaceIndex(face.index)}
                >
                  <img
                    src={`data:image/jpeg;base64,${face.imageBase64}`}
                    alt={`얼굴 ${face.index + 1}`}
                  />
                  {selectedFaceIndex === face.index && (
                    <FaceCheckMark>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </FaceCheckMark>
                  )}
                </FaceCard>
              ))}
            </FaceGrid>

            <ModalFooter>
              <ModalCancelBtn onClick={() => {
                setSelectedFaceIndex(null);
                setShowFaceModal(false);
              }}>
                선택 안 함
              </ModalCancelBtn>
              <ModalConfirmBtn
                $disabled={selectedFaceIndex === null}
                disabled={selectedFaceIndex === null}
                onClick={() => {
                  setShowFaceModal(false);
                  search();
                }}
              >
                검색
              </ModalConfirmBtn>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageLayout>
  );
}
