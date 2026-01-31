'use client';

import { useState, useRef } from 'react';
import styled from '@emotion/styled';
import PageLayout from '@/components/PageLayout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const SearchCard = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
`;

const UploadArea = styled.div<{ $hasFile: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 140px;
  background: ${props => props.$hasFile
    ? 'linear-gradient(135deg, #fff8e6 0%, #fff3d6 100%)'
    : 'linear-gradient(135deg, #f8f9fa 0%, #f2f4f6 100%)'};
  border: 2px dashed ${props => props.$hasFile ? '#ff9500' : '#e5e8eb'};
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.$hasFile ? '#ff9500' : '#adb5bd'};
  }
`;

const UploadIconWrapper = styled.div<{ $hasFile: boolean }>`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: ${props => props.$hasFile
    ? 'linear-gradient(135deg, #ff9500 0%, #f59e0b 100%)'
    : 'linear-gradient(135deg, #6b7684 0%, #8b95a1 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  box-shadow: 0 4px 12px ${props => props.$hasFile ? 'rgba(255, 149, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
`;

const PreviewImage = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  object-fit: cover;
`;

const UploadText = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #191f28;
`;

const UploadHint = styled.div`
  font-size: 12px;
  color: #8b95a1;
  margin-top: 2px;
`;

const HiddenInput = styled.input`
  display: none;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 20px 0;
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e5e8eb, transparent);
`;

const DividerText = styled.span`
  font-size: 12px;
  color: #adb5bd;
  font-weight: 500;
`;

const InputGroup = styled.div`
  margin-bottom: 14px;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #6b7684;
  margin-bottom: 8px;
`;

const OptionalBadge = styled.span`
  font-size: 10px;
  padding: 2px 6px;
  background: #f2f4f6;
  border-radius: 4px;
  color: #8b95a1;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 1.5px solid #e5e8eb;
  border-radius: 12px;
  background: #f9fafb;
  font-size: 15px;
  color: #191f28;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #ff9500;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(255, 149, 0, 0.1);
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #ff9500 0%, #f59e0b 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 6px;
  box-shadow: 0 4px 14px rgba(255, 149, 0, 0.35);
  transition: all 0.2s;

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background: #e5e8eb;
    color: #adb5bd;
    box-shadow: none;
  }
`;

const ResultSection = styled.div`
  margin-top: 28px;
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 0 4px;
`;

const ResultTitle = styled.h3`
  font-size: 17px;
  font-weight: 700;
  color: #191f28;
  margin: 0;
  display: flex;
  align-items: center;
`;

const ResultCount = styled.span`
  font-size: 13px;
  color: #8b95a1;
  background: #f2f4f6;
  padding: 4px 10px;
  border-radius: 20px;
`;

// 스캐머 경고 섹션
const ScammerAlertSection = styled.div`
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 2px solid #fca5a5;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
`;

const ScammerAlertHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const ScammerAlertIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
`;

const ScammerAlertTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #dc2626;
`;

const ScammerAlertSubtitle = styled.div`
  font-size: 13px;
  color: #991b1b;
`;

const ScammerCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 10px;
  border: 1px solid #fecaca;
`;

const ScammerInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ScammerName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #191f28;
`;

const ScammerMeta = styled.div`
  font-size: 12px;
  color: #6b7684;
  margin-top: 4px;
`;

const ConfidenceBadge = styled.span<{ $confidence: number }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  background: ${props =>
    props.$confidence >= 80 ? '#dc2626' :
    props.$confidence >= 60 ? '#f59e0b' : '#6b7684'};
  color: #fff;
`;

// 안전 결과 섹션
const SafeResultSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border: 2px solid #6ee7b7;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
`;

const SafeResultIcon = styled.div`
  font-size: 32px;
`;

const SafeResultText = styled.div``;

const SafeResultTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #059669;
`;

const SafeResultSubtitle = styled.div`
  font-size: 13px;
  color: #047857;
  margin-top: 4px;
`;

// 역이미지 검색 섹션
const ReverseSearchSection = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const ReverseSearchTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #191f28;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ReverseSearchHint = styled.div`
  font-size: 12px;
  color: #6b7684;
  margin-bottom: 14px;
`;

const ReverseSearchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const ReverseSearchLink = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  background: linear-gradient(135deg, #f8f9fa 0%, #f2f4f6 100%);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s;

  &:active {
    transform: scale(0.98);
    background: #e5e8eb;
  }
`;

const ReverseSearchIcon = styled.span`
  font-size: 20px;
`;

const ReverseSearchName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #191f28;
`;

// 웹 검색 결과 섹션
const WebSearchSection = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const WebSearchTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #191f28;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const WebSearchSubtitle = styled.div`
  font-size: 12px;
  color: #6b7684;
  margin-bottom: 16px;
`;

const WebSearchResultCard = styled.a`
  display: flex;
  gap: 14px;
  padding: 14px;
  background: linear-gradient(135deg, #f8f9fa 0%, #f2f4f6 100%);
  border-radius: 12px;
  text-decoration: none;
  margin-bottom: 10px;
  transition: all 0.2s;

  &:active {
    transform: scale(0.98);
    background: #e5e8eb;
  }
`;

const WebSearchThumbnail = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  background: #e5e8eb;
`;

const WebSearchThumbnailPlaceholder = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: linear-gradient(135deg, #e5e8eb 0%, #d1d5db 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const WebSearchInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const WebSearchResultTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #191f28;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const WebSearchSource = styled.div`
  font-size: 12px;
  color: #6b7684;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const WebResultMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
`;

const PlatformBadge = styled.span<{ $platform: string }>`
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  background: ${props => {
    switch (props.$platform) {
      case 'instagram': return 'linear-gradient(135deg, #E4405F, #C13584)';
      case 'facebook': return 'linear-gradient(135deg, #1877F2, #0d65d9)';
      case 'linkedin': return 'linear-gradient(135deg, #0A66C2, #004182)';
      case 'twitter': return 'linear-gradient(135deg, #000, #333)';
      case 'tiktok': return 'linear-gradient(135deg, #000, #25F4EE)';
      case 'vk': return 'linear-gradient(135deg, #4a76a8, #3b5998)';
      default: return 'linear-gradient(135deg, #6b7684, #8b95a1)';
    }
  }};
  color: white;
`;

const MatchScoreBadge = styled.span<{ $score: number }>`
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  background: ${props => {
    if (props.$score >= 80) return 'linear-gradient(135deg, #dc2626, #b91c1c)';
    if (props.$score >= 60) return 'linear-gradient(135deg, #f59e0b, #d97706)';
    if (props.$score >= 40) return 'linear-gradient(135deg, #10b981, #059669)';
    return 'linear-gradient(135deg, #6b7684, #8b95a1)';
  }};
  color: white;
`;

// 이미지 비교 섹션
const ImageCompareSection = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const ImageCompareHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const ImageCompareTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #191f28;
`;

const ImageCompareCount = styled.span`
  background: #ff9500;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
`;

const UploadedImageSection = styled.div`
  text-align: center;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e8eb;
`;

const UploadedImageLabel = styled.div`
  font-size: 13px;
  color: #6b7684;
  margin-bottom: 12px;
  font-weight: 600;
`;

const UploadedImagePreview = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 12px;
  object-fit: cover;
  border: 3px solid #ff9500;
  box-shadow: 0 4px 12px rgba(255, 149, 0, 0.3);
`;

const FoundImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (min-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FoundImageCard = styled.a`
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  transition: all 0.2s;
  border: 2px solid transparent;

  &:hover {
    border-color: #ff9500;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const FoundImageThumbnail = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  background: #e5e8eb;
`;

const FoundImagePlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background: linear-gradient(135deg, #e5e8eb, #d1d5db);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
`;

const FoundImageInfo = styled.div`
  padding: 10px;
`;

const FoundImageSource = styled.div`
  font-size: 11px;
  color: #6b7684;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FoundImageBadges = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
`;

const FoundImageMatchScore = styled.div<{ $score: number }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  background: ${props => {
    if (props.$score >= 80) return '#fee2e2';
    if (props.$score >= 60) return '#fef3c7';
    if (props.$score >= 40) return '#d1fae5';
    return '#f3f4f6';
  }};
  color: ${props => {
    if (props.$score >= 80) return '#dc2626';
    if (props.$score >= 60) return '#d97706';
    if (props.$score >= 40) return '#059669';
    return '#6b7684';
  }};
`;

const NoImageResults = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6b7684;
`;

const NoImageResultsIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
`;

const NoImageResultsText = styled.div`
  font-size: 14px;
`;

// 신고 버튼
const ReportButton = styled.button`
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background: #e5e8eb;
    color: #adb5bd;
  }
`;

const PlatformSection = styled.div`
  margin-bottom: 24px;
`;

const PlatformHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  padding: 0 4px;
`;

const PlatformIconWrapper = styled.div<{ $color: string }>`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlatformName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #191f28;
`;

const ProfileCard = styled.a`
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

const ProfileImageWrapper = styled.div`
  position: relative;
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  background: linear-gradient(135deg, #f2f4f6 0%, #e5e8eb 100%);
`;

const ProfileInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ProfileName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #191f28;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
`;

const ProfileUsername = styled.div`
  font-size: 13px;
  color: #8b95a1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MatchBadge = styled.span<{ $score: number }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  background: ${props =>
    props.$score >= 80 ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)' :
    props.$score >= 50 ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' :
    'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'};
  color: ${props => props.$score >= 80 ? '#dc2626' : props.$score >= 50 ? '#d97706' : '#059669'};
  flex-shrink: 0;
`;

const ArrowIcon = styled.div`
  color: #d1d5db;
  margin-left: 4px;
`;

const NoResult = styled.div`
  padding: 48px 20px;
  text-align: center;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const NoResultIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
`;

const NoResultText = styled.div`
  font-size: 15px;
  color: #6b7684;
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border-radius: 12px;
  color: #dc2626;
  font-size: 14px;
  margin-top: 16px;
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-radius: 12px;
  color: #059669;
  font-size: 14px;
  margin-top: 16px;
`;

const TipCard = styled.div`
  margin-top: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #fff 0%, #fafbfc 100%);
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.04);
`;

const TipHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
`;

const TipIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;

const TipTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #191f28;
`;

const TipList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TipItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: #6b7684;
  line-height: 1.5;
`;

const TipBullet = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d1d5db;
  margin-top: 6px;
  flex-shrink: 0;
`;

interface ProfileResult {
  platform: string;
  name: string;
  username: string;
  profileUrl: string;
  imageUrl: string;
  matchScore: number;
}

interface ScammerMatch {
  id: string;
  name: string;
  confidence: number;
  reportCount: number;
  reportedAt: Date;
}

interface ReverseSearchLinkData {
  platform: string;
  name: string;
  url: string;
  icon: string;
}

interface WebImageResult {
  title: string;
  sourceUrl: string;
  imageUrl: string;
  thumbnailUrl: string | null;
  platform: string;
  matchScore: number;
}

interface SearchResult {
  totalFound: number;
  scammerMatches: ScammerMatch[];
  reverseSearchLinks: ReverseSearchLinkData[];
  webImageResults: WebImageResult[];
  uploadedImageUrl: string | null;
  results: {
    instagram: ProfileResult[];
    facebook: ProfileResult[];
    twitter: ProfileResult[];
    linkedin: ProfileResult[];
    google: ProfileResult[];
  };
}

const platformConfig: Record<string, { icon: string; name: string; color: string }> = {
  instagram: { icon: '📷', name: 'Instagram', color: 'linear-gradient(135deg, #E4405F 0%, #C13584 100%)' },
  facebook: { icon: '👤', name: 'Facebook', color: 'linear-gradient(135deg, #1877F2 0%, #0d65d9 100%)' },
  twitter: { icon: '✕', name: 'X', color: 'linear-gradient(135deg, #000 0%, #333 100%)' },
  linkedin: { icon: '💼', name: 'LinkedIn', color: 'linear-gradient(135deg, #0A66C2 0%, #004182 100%)' },
  google: { icon: '🔍', name: 'Google', color: 'linear-gradient(135deg, #4285F4 0%, #1a73e8 100%)' },
};

export default function ProfileSearchPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reportSuccess, setReportSuccess] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setResult(null);
      setError(null);
      setReportSuccess(null);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const canSearch = file || name.trim();

  const hasAnyPlatformResults = (results: SearchResult['results']) => {
    return Object.values(results).some(arr => arr.length > 0);
  };

  const search = async () => {
    if (!canSearch) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setReportSuccess(null);

    try {
      const formData = new FormData();
      if (file) formData.append('image', file);
      if (name.trim()) formData.append('query', name.trim());

      console.log('[ProfileSearch] Sending request to:', `${API_URL}/api/profile/search`);
      console.log('[ProfileSearch] Has image:', !!file, 'Has query:', !!name.trim());

      const response = await fetch(`${API_URL}/api/profile/search`, {
        method: 'POST',
        body: formData,
      });

      console.log('[ProfileSearch] Response status:', response.status);

      const data = await response.json();
      console.log('[ProfileSearch] Response data:', data);

      if (response.ok && data.success) {
        // Ensure all required fields exist with defaults
        const safeData = {
          totalFound: data.data?.totalFound ?? 0,
          scammerMatches: data.data?.scammerMatches ?? [],
          reverseSearchLinks: data.data?.reverseSearchLinks ?? [],
          webImageResults: data.data?.webImageResults ?? [],
          uploadedImageUrl: data.data?.uploadedImageUrl ?? null,
          results: {
            instagram: data.data?.results?.instagram ?? [],
            facebook: data.data?.results?.facebook ?? [],
            twitter: data.data?.results?.twitter ?? [],
            linkedin: data.data?.results?.linkedin ?? [],
            google: data.data?.results?.google ?? [],
          }
        };
        setResult(safeData);
      } else {
        setError(data.error || '검색 중 오류가 발생했습니다');
      }
    } catch (err) {
      console.error('[ProfileSearch] Error:', err);
      setError(err instanceof Error ? err.message : '서버에 연결할 수 없습니다');
    } finally {
      setLoading(false);
    }
  };

  const reportScammer = async () => {
    if (!file || !name.trim()) {
      setError('스캐머 신고를 위해 사진과 이름이 필요합니다');
      return;
    }

    setReporting(true);
    setError(null);
    setReportSuccess(null);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('name', name.trim());

      const response = await fetch(`${API_URL}/api/profile/report`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setReportSuccess(data.data.message);
      } else {
        setError(data.error || '신고 중 오류가 발생했습니다');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '서버에 연결할 수 없습니다');
    } finally {
      setReporting(false);
    }
  };

  const renderPlatformResults = (platform: string, profiles: ProfileResult[]) => {
    if (profiles.length === 0) return null;
    const config = platformConfig[platform];

    return (
      <PlatformSection key={platform}>
        <PlatformHeader>
          <PlatformIconWrapper $color={config.color}>
            <span style={{ fontSize: '14px', filter: 'brightness(10)' }}>{config.icon}</span>
          </PlatformIconWrapper>
          <PlatformName>{config.name}</PlatformName>
        </PlatformHeader>
        {profiles.map((profile, i) => (
          <ProfileCard key={i} href={profile.profileUrl} target="_blank" rel="noopener noreferrer">
            <ProfileImageWrapper>
              <ProfileImage src={profile.imageUrl} alt={profile.name} />
            </ProfileImageWrapper>
            <ProfileInfo>
              <ProfileName>{profile.name}</ProfileName>
              <ProfileUsername>@{profile.username}</ProfileUsername>
            </ProfileInfo>
            <MatchBadge $score={profile.matchScore}>
              {profile.matchScore}%
            </MatchBadge>
            <ArrowIcon>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </ArrowIcon>
          </ProfileCard>
        ))}
      </PlatformSection>
    );
  };

  return (
    <PageLayout title="프로필 검색">
      <SearchCard>
        <UploadArea $hasFile={!!file} onClick={() => inputRef.current?.click()}>
          {preview ? (
            <>
              <PreviewImage src={preview} alt="Profile" />
              <UploadText style={{ marginTop: 10 }}>사진 변경하기</UploadText>
            </>
          ) : (
            <>
              <UploadIconWrapper $hasFile={false}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                </svg>
              </UploadIconWrapper>
              <UploadText>프로필 사진으로 검색</UploadText>
              <UploadHint>가장 정확한 검색 방법이에요</UploadHint>
            </>
          )}
          <HiddenInput
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </UploadArea>

        <Divider>
          <DividerLine />
          <DividerText>또는</DividerText>
          <DividerLine />
        </Divider>

        <InputGroup>
          <Label>
            이름 또는 사용자명
            <OptionalBadge>선택</OptionalBadge>
          </Label>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="예: John Smith, @johnsmith"
          />
        </InputGroup>

        <Button onClick={search} disabled={!canSearch || loading}>
          {loading ? '검색 중...' : '프로필 검색'}
        </Button>

        {file && name.trim() && (
          <ReportButton onClick={reportScammer} disabled={reporting}>
            {reporting ? '신고 중...' : '이 사람 스캐머로 신고하기'}
          </ReportButton>
        )}
      </SearchCard>

      {error && (
        <ErrorMessage>
          <span>⚠️</span>
          {error}
        </ErrorMessage>
      )}

      {reportSuccess && (
        <SuccessMessage>
          <span>✓</span>
          {reportSuccess}
        </SuccessMessage>
      )}

      {result && (
        <ResultSection>
          {/* 스캐머 DB 검사 결과 - 일치하는 경우에만 표시 */}
          {result.scammerMatches && result.scammerMatches.length > 0 && (
            <ScammerAlertSection>
              <ScammerAlertHeader>
                <ScammerAlertIcon>⚠️</ScammerAlertIcon>
                <div>
                  <ScammerAlertTitle>스캐머 의심!</ScammerAlertTitle>
                  <ScammerAlertSubtitle>신고된 스캐머와 일치하는 얼굴이 발견됐어요</ScammerAlertSubtitle>
                </div>
              </ScammerAlertHeader>
              {result.scammerMatches.map((scammer, i) => (
                <ScammerCard key={i}>
                  <ScammerInfo>
                    <div>
                      <ScammerName>{scammer.name}</ScammerName>
                      <ScammerMeta>신고 {scammer.reportCount}회</ScammerMeta>
                    </div>
                    <ConfidenceBadge $confidence={scammer.confidence}>
                      {scammer.confidence}% 일치
                    </ConfidenceBadge>
                  </ScammerInfo>
                </ScammerCard>
              ))}
            </ScammerAlertSection>
          )}

          {/* 이미지 비교 섹션 */}
          <ImageCompareSection>
            <ImageCompareHeader>
              <span style={{ fontSize: '20px' }}>🔍</span>
              <ImageCompareTitle>역이미지 검색 결과</ImageCompareTitle>
              {result.webImageResults && result.webImageResults.length > 0 && (
                <ImageCompareCount>{result.webImageResults.length}건 발견</ImageCompareCount>
              )}
            </ImageCompareHeader>

            {/* 업로드한 이미지 */}
            {preview && (
              <UploadedImageSection>
                <UploadedImageLabel>📤 업로드한 이미지</UploadedImageLabel>
                <UploadedImagePreview src={preview} alt="Uploaded" />
              </UploadedImageSection>
            )}

            {/* 발견된 이미지들 */}
            {result.webImageResults && result.webImageResults.length > 0 ? (
              <>
                <UploadedImageLabel style={{ textAlign: 'left', marginBottom: '12px' }}>
                  🌐 웹에서 발견된 위치
                </UploadedImageLabel>
                <FoundImagesGrid>
                  {result.webImageResults.map((item, i) => (
                    <FoundImageCard key={i} href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
                      {item.thumbnailUrl ? (
                        <FoundImageThumbnail src={item.thumbnailUrl} alt={item.title} />
                      ) : (
                        <FoundImagePlaceholder>
                          {item.platform === 'instagram' ? '📷' :
                           item.platform === 'facebook' ? '👤' :
                           item.platform === 'linkedin' ? '💼' :
                           item.platform === 'twitter' ? '🐦' : '🔗'}
                        </FoundImagePlaceholder>
                      )}
                      <FoundImageInfo>
                        <FoundImageSource>
                          {(() => {
                            try {
                              return new URL(item.sourceUrl).hostname;
                            } catch {
                              return item.sourceUrl.slice(0, 30);
                            }
                          })()}
                        </FoundImageSource>
                        <FoundImageBadges>
                          <PlatformBadge $platform={item.platform}>
                            {item.platform === 'other' ? 'WEB' : item.platform.toUpperCase()}
                          </PlatformBadge>
                          {item.matchScore > 0 && (
                            <FoundImageMatchScore $score={item.matchScore}>
                              {item.matchScore.toFixed(0)}%
                            </FoundImageMatchScore>
                          )}
                        </FoundImageBadges>
                      </FoundImageInfo>
                    </FoundImageCard>
                  ))}
                </FoundImagesGrid>
              </>
            ) : (
              <NoImageResults>
                <NoImageResultsIcon>🔍</NoImageResultsIcon>
                <NoImageResultsText>웹에서 유사한 이미지를 찾지 못했습니다</NoImageResultsText>
              </NoImageResults>
            )}
          </ImageCompareSection>

          {/* 수동 역이미지 검색 링크 (이미지 업로드 실패 시) */}
          {result.reverseSearchLinks && result.reverseSearchLinks.length > 0 && (
            <ReverseSearchSection>
              <ReverseSearchTitle>
                <span>🔍</span>
                직접 역이미지 검색하기
              </ReverseSearchTitle>
              <ReverseSearchHint>사진을 저장한 후 아래 사이트에서 업로드하세요</ReverseSearchHint>
              <ReverseSearchGrid>
                {result.reverseSearchLinks.map((link, i) => (
                  <ReverseSearchLink key={i} href={link.url} target="_blank" rel="noopener noreferrer">
                    <ReverseSearchIcon>{link.icon}</ReverseSearchIcon>
                    <ReverseSearchName>{link.name}</ReverseSearchName>
                  </ReverseSearchLink>
                ))}
              </ReverseSearchGrid>
            </ReverseSearchSection>
          )}

          {/* 플랫폼별 검색 링크 (이름이 입력된 경우만) */}
          {hasAnyPlatformResults(result.results) && (
            <>
              <ResultHeader>
                <ResultTitle>플랫폼에서 직접 검색</ResultTitle>
              </ResultHeader>
              {renderPlatformResults('instagram', result.results.instagram)}
              {renderPlatformResults('facebook', result.results.facebook)}
              {renderPlatformResults('twitter', result.results.twitter)}
              {renderPlatformResults('linkedin', result.results.linkedin)}
              {renderPlatformResults('google', result.results.google)}
            </>
          )}
        </ResultSection>
      )}

      <TipCard>
        <TipHeader>
          <TipIcon>💡</TipIcon>
          <TipTitle>검색 팁</TipTitle>
        </TipHeader>
        <TipList>
          <TipItem>
            <TipBullet />
            프로필 사진으로 검색하면 스캐머 DB와 비교해요
          </TipItem>
          <TipItem>
            <TipBullet />
            역이미지 검색으로 다른 곳에서 사용된 사진 찾기
          </TipItem>
          <TipItem>
            <TipBullet />
            스캐머로 의심되면 신고해서 다른 사람들을 보호해요
          </TipItem>
        </TipList>
      </TipCard>
    </PageLayout>
  );
}
