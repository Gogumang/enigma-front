import { useState, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { PageLayout, ImageDropzone } from '@/shared/ui';
import { useProfileSearch, useFaceDetect, type DetectedFace } from '@/features/search-profile';
import { memoryStore } from '@/shared/lib/storage';
import Lottie from 'lottie-react';
import aiScanAnimation from '@/shared/assets/lottie/ai-scan.json';
import {
  ContentWrapper,
  DropzoneWrapper,
  Button,
  TipCard,
  TipTitle,
  TipList,
  TipItem,
  ErrorMessage,
  LoadingOverlay,
  LoadingLottieWrapper,
  LoadingText,
  LoadingSubtext,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDesc,
  FacePreviewWrapper,
  FacePreviewImage,
  FaceBoundingBox,
  FaceBboxLabel,
  FaceGridLabel,
  FaceGrid,
  FaceCard,
  FaceCheckMark,
  ModalFooter,
  ModalCancelBtn,
  ModalConfirmBtn,
  DetectingText,
} from './ProfileSearchPage.styles';


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
    <PageLayout title="이미지 검색">
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
          {profileSearch.isPending ? '검색 중...' : '이미지 검색'}
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

      {profileSearch.isPending && (
        <LoadingOverlay>
          <LoadingLottieWrapper>
            <Lottie animationData={aiScanAnimation} loop />
          </LoadingLottieWrapper>
          <LoadingText>이미지 검색 중...</LoadingText>
          <LoadingSubtext>이미지를 분석하고 유사 프로필을 검색하고 있습니다</LoadingSubtext>
        </LoadingOverlay>
      )}

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
