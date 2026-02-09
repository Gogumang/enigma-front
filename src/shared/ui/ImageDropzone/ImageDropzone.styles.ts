import styled from '@emotion/styled';

export const DropzoneContainer = styled.div<{ $isDragActive: boolean; $hasFile: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: ${props => props.$hasFile ? 'auto' : '160px'};
  padding: 20px;
  background: ${props =>
    props.$isDragActive
      ? 'linear-gradient(135deg, #e8f4ff 0%, #dbeafe 100%)'
      : props.$hasFile
        ? 'linear-gradient(135deg, #fff8e6 0%, #fff3d6 100%)'
        : 'linear-gradient(135deg, #f8f9fa 0%, #f2f4f6 100%)'};
  border: 2px dashed ${props =>
    props.$isDragActive ? '#3182f6' : props.$hasFile ? '#ff9500' : '#e5e8eb'};
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;

  &:hover {
    border-color: ${props => props.$hasFile ? '#ff9500' : '#adb5bd'};
    background: ${props =>
      props.$hasFile
        ? 'linear-gradient(135deg, #fff8e6 0%, #fff3d6 100%)'
        : 'linear-gradient(135deg, #f2f4f6 0%, #e5e8eb 100%)'};
  }
`;

export const IconWrapper = styled.div<{ $hasFile: boolean }>`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: ${props => props.$hasFile
    ? 'linear-gradient(135deg, #ff9500 0%, #f59e0b 100%)'
    : 'linear-gradient(135deg, #6b7684 0%, #8b95a1 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  box-shadow: 0 4px 12px ${props => props.$hasFile ? 'rgba(255, 149, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
`;

export const PreviewImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 16px;
  object-fit: cover;
  border: 3px solid #ff9500;
  box-shadow: 0 4px 12px rgba(255, 149, 0, 0.3);
  margin-bottom: 12px;
`;

export const PreviewVideo = styled.video`
  max-width: 100%;
  max-height: 200px;
  border-radius: 12px;
  margin-bottom: 12px;
`;

export const Title = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #191f28;
  margin-bottom: 4px;
`;

export const Hint = styled.div`
  font-size: 13px;
  color: #8b95a1;
`;

export const DragActiveText = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #3182f6;
`;

export const CompressingText = styled.div`
  font-size: 13px;
  color: #ff9500;
  margin-top: 8px;
`;

export const FileInfo = styled.div`
  font-size: 12px;
  color: #6b7684;
  margin-top: 8px;
`;
