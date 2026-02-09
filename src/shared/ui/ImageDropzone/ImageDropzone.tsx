import { useCallback, useState } from 'react';
import { useDropzone, type Accept } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import {
  DropzoneContainer,
  IconWrapper,
  PreviewImage,
  PreviewVideo,
  Title,
  Hint,
  DragActiveText,
  CompressingText,
  FileInfo,
} from './ImageDropzone.styles';

interface ImageDropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: 'image' | 'image+video';
  title?: string;
  hint?: string;
  icon?: React.ReactNode;
  maxSizeMB?: number;
  showPreview?: boolean;
}

export function ImageDropzone({
  onFileSelect,
  accept = 'image',
  title = '이미지를 업로드하세요',
  hint = '드래그하거나 클릭하여 선택',
  icon,
  maxSizeMB = 2,
  showPreview = true,
}: ImageDropzoneProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string } | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const isVideoFile = file.type.startsWith('video/');
    setIsVideo(isVideoFile);

    let processedFile = file;

    // 이미지인 경우 압축
    if (!isVideoFile && file.size > maxSizeMB * 1024 * 1024) {
      setIsCompressing(true);
      try {
        processedFile = await imageCompression(file, {
          maxSizeMB,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });
      } catch (error) {
        console.error('Image compression failed:', error);
      }
      setIsCompressing(false);
    }

    // 파일 정보 설정
    setFileInfo({
      name: file.name,
      size: formatFileSize(processedFile.size),
    });

    // 미리보기 생성
    if (showPreview) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(processedFile);
    }

    onFileSelect(processedFile);
  }, [onFileSelect, maxSizeMB, showPreview]);

  const acceptConfig: Accept = accept === 'image+video'
    ? { 'image/*': [], 'video/*': [] }
    : { 'image/*': [] };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptConfig,
    maxFiles: 1,
    multiple: false,
  });

  const defaultIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );

  return (
    <DropzoneContainer
      {...getRootProps()}
      $isDragActive={isDragActive}
      $hasFile={!!preview}
    >
      <input {...getInputProps()} />

      {isDragActive ? (
        <>
          <IconWrapper $hasFile={false}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </IconWrapper>
          <DragActiveText>여기에 놓으세요!</DragActiveText>
        </>
      ) : preview ? (
        <>
          {isVideo ? (
            <PreviewVideo src={preview} controls />
          ) : (
            <PreviewImage src={preview} alt="Preview" />
          )}
          <Title>다른 파일 선택하기</Title>
          {fileInfo && (
            <FileInfo>{fileInfo.name} ({fileInfo.size})</FileInfo>
          )}
        </>
      ) : (
        <>
          {title || hint ? (
            <IconWrapper $hasFile={false}>
              {icon || defaultIcon}
            </IconWrapper>
          ) : (
            <div style={{ color: '#8b95a1' }}>{icon || defaultIcon}</div>
          )}
          {title && <Title>{title}</Title>}
          {hint && <Hint>{hint}</Hint>}
        </>
      )}

      {isCompressing && (
        <CompressingText>이미지 압축 중...</CompressingText>
      )}
    </DropzoneContainer>
  );
}
