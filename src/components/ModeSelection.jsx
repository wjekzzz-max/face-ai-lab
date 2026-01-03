import './ModeSelection.css'

function ModeSelection({ onModeSelect }) {
  return (
    <div className="mode-selection">
      <h2 className="mode-selection-title">모드를 선택해주세요</h2>
      <div className="mode-cards">
        <div className="mode-card" onClick={() => onModeSelect('celebrity')}>
          <div className="mode-icon">⭐</div>
          <h3>닮은 연예인 찾기</h3>
          <p>이미지 분위기 유사도를 확인해보세요</p>
        </div>
        <div className="mode-card" onClick={() => onModeSelect('career')}>
          <div className="mode-icon">💼</div>
          <h3>미래 직업 추천</h3>
          <p>이미지 분위기로 직업 분야 예시를 확인해보세요</p>
        </div>
      </div>
      <div className="mode-notice">
        <p>💡 모든 결과는 참고용이며 재미와 체험 목적입니다.</p>
      </div>
    </div>
  )
}

export default ModeSelection

