import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const UploadedImageWrapper = styled.div`
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
`;

export const UploadedImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  display: block;
`;

export const DetailCard = styled.div`
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

export const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f2f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

export const DetailLabel = styled.div`
  font-size: 14px;
  color: #6b7684;
`;

export const DetailValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #191f28;
`;

export const SectionTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #191f28;
  margin-bottom: 12px;
  padding: 0 4px;
`;

export const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

export const ImageCard = styled.a`
  display: block;
  border-radius: 12px;
  overflow: hidden;
  background: #f8f9fa;
  text-decoration: none;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.98);
  }
`;

export const ImageThumbnail = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
`;

export const ImagePlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background: linear-gradient(135deg, #e5e8eb, #d1d5db);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

export const ProfileCard = styled.a`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: #fff;
  border-radius: 14px;
  text-decoration: none;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.2s;

  &:active {
    transform: scale(0.99);
    background: #fafbfc;
  }
`;

export const ProfileImage = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  background: #e5e8eb;
`;

export const ProfileInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ProfileName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #191f28;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ProfileUsername = styled.div`
  font-size: 13px;
  color: #8b95a1;
`;

export const MatchBadge = styled.span<{ $score: number }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  background: ${props =>
    props.$score >= 80 ? '#ffebee' :
    props.$score >= 50 ? '#fff8e6' : '#e8f7f0'};
  color: ${props =>
    props.$score >= 80 ? '#f04452' :
    props.$score >= 50 ? '#ff9500' : '#20c997'};
`;

export const ReverseSearchSection = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

export const ReverseSearchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

export const ReverseSearchLink = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  background: #f8f9fa;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s;

  &:active {
    background: #e5e8eb;
  }
`;

export const ReverseSearchIcon = styled.span`
  font-size: 20px;
`;

export const ReverseSearchName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #191f28;
`;

export const BackButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #3182f6;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;

  &:active {
    background: #1b64da;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7684;
`;
