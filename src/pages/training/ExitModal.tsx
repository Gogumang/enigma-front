import {
  ModalBox,
  ModalButton,
  ModalButtons,
  ModalMessage,
  ModalOverlay,
  ModalTitle,
} from './TrainingPage.styles';

interface ExitModalProps {
  currentPlatform: string;
  onClose: () => void;
  onExit: () => void;
}

export default function ExitModal({ currentPlatform, onClose, onExit }: ExitModalProps) {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <ModalTitle>훈련 종료</ModalTitle>
        <ModalMessage>
          훈련을 종료하시겠습니까?
          <br />
          진행 상황이 저장되지 않습니다.
        </ModalMessage>
        <ModalButtons>
          <ModalButton onClick={onClose}>계속하기</ModalButton>
          <ModalButton $primary $platform={currentPlatform} onClick={onExit}>
            종료하기
          </ModalButton>
        </ModalButtons>
      </ModalBox>
    </ModalOverlay>
  );
}
