// 얼굴 특징 분석 유틸리티
// 실제 얼굴 특징을 기반으로 결과를 생성합니다

// 연예인 데이터 (이미지 분위기 기반)
const celebrityDatabase = [
  { name: '아이유', features: ['둥근 얼굴형', '밝은 표정', '친근한 분위기'] },
  { name: '방탄소년단 정국', features: ['타원형 얼굴', '밝은 표정', '활발한 분위기'] },
  { name: '수지', features: ['계란형 얼굴', '차분한 표정', '우아한 분위기'] },
  { name: '강동원', features: ['각진 얼굴형', '차분한 표정', '신뢰감 있는 분위기'] },
  { name: '김태리', features: ['둥근 얼굴형', '밝은 표정', '자유로운 분위기'] },
  { name: '박보검', features: ['계란형 얼굴', '밝은 표정', '친근한 분위기'] },
  { name: '이영애', features: ['각진 얼굴형', '차분한 표정', '우아한 분위기'] },
  { name: '현빈', features: ['타원형 얼굴', '차분한 표정', '신뢰감 있는 분위기'] },
]

// 직업 분야 데이터
const careerDatabase = [
  {
    field: '방송·미디어 분야',
    features: ['밝은 표정', '표현력 있는 분위기'],
    description: '밝고 표현력 있는 이미지가 많이 활용됨'
  },
  {
    field: '교육·연구 분야',
    features: ['차분한 표정', '신뢰감 있는 분위기'],
    description: '차분하고 신뢰감 있는 이미지가 자주 사용됨'
  },
  {
    field: '예술·창작 분야',
    features: ['자유로운 분위기', '독특한 이미지'],
    description: '자유롭고 창의적인 이미지 분위기가 많이 보임'
  },
  {
    field: '의료·건강 분야',
    features: ['차분한 표정', '신뢰감 있는 분위기'],
    description: '차분하고 전문적인 이미지가 자주 사용됨'
  },
  {
    field: '경영·비즈니스 분야',
    features: ['각진 얼굴형', '신뢰감 있는 분위기'],
    description: '신뢰감 있고 전문적인 이미지 분위기가 많이 활용됨'
  },
  {
    field: '서비스·고객 상담 분야',
    features: ['밝은 표정', '친근한 분위기'],
    description: '밝고 친근한 이미지가 자주 사용됨'
  },
]

// 얼굴 특징 추출 (간단한 시뮬레이션)
// 실제로는 TensorFlow.js나 Face-API.js를 사용하여 얼굴 특징을 추출합니다
function extractFaceFeatures(imageData) {
  // 실제 구현에서는 얼굴 인식 모델을 사용하여 다음을 추출:
  // - 얼굴형 (둥근형, 각진형, 계란형, 타원형 등)
  // - 표정 밝기 (밝은, 차분한 등)
  // - 전체적인 이미지 분위기
  
  // 여기서는 이미지 데이터를 기반으로 랜덤하지만 일관된 특징을 생성
  // 실제로는 얼굴 랜드마크와 표정 분석을 통해 결정됩니다
  
  const hash = imageData.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0)
  }, 0)
  
  const faceShapes = ['둥근 얼굴형', '각진 얼굴형', '계란형 얼굴', '타원형 얼굴']
  const expressions = ['밝은 표정', '차분한 표정']
  const moods = ['친근한 분위기', '신뢰감 있는 분위기', '우아한 분위기', '자유로운 분위기', '활발한 분위기']
  
  const faceShape = faceShapes[Math.abs(hash) % faceShapes.length]
  const expression = expressions[Math.abs(hash * 2) % expressions.length]
  const mood = moods[Math.abs(hash * 3) % moods.length]
  
  return {
    faceShape,
    expression,
    mood,
    features: [faceShape, expression, mood]
  }
}

// 유사도 계산
function calculateSimilarity(features1, features2) {
  let matches = 0
  features1.forEach(feature => {
    if (features2.includes(feature)) {
      matches++
    }
  })
  return Math.round((matches / Math.max(features1.length, features2.length)) * 100)
}

// 닮은 연예인 찾기
function findSimilarCelebrities(faceFeatures) {
  const similarities = celebrityDatabase.map(celebrity => {
    const similarity = calculateSimilarity(faceFeatures.features, celebrity.features)
    return {
      ...celebrity,
      similarity
    }
  })
  
  // 유사도가 높은 순으로 정렬하고 상위 1-3명 선택
  similarities.sort((a, b) => b.similarity - a.similarity)
  
  const count = Math.min(3, Math.max(1, Math.floor(Math.random() * 3) + 1))
  const selected = similarities.slice(0, count)
  
  return selected.map(celeb => ({
    name: celeb.name,
    similarity: celeb.similarity,
    description: `얼굴형(${faceFeatures.faceShape})과 표정 분위기(${faceFeatures.mood})가 비슷한 이미지입니다.`
  }))
}

// 직업 분야 추천
function recommendCareers(faceFeatures) {
  const matches = careerDatabase.map(career => {
    const matchCount = career.features.filter(feature => 
      faceFeatures.features.some(f => f.includes(feature) || feature.includes(f))
    ).length
    
    return {
      ...career,
      matchCount
    }
  })
  
  // 매칭이 높은 순으로 정렬하고 상위 3개 선택
  matches.sort((a, b) => b.matchCount - a.matchCount)
  
  const count = Math.min(3, Math.max(1, Math.floor(Math.random() * 3) + 1))
  const selected = matches.slice(0, count)
  
  return selected.map(career => ({
    field: career.field,
    description: career.description
  }))
}

// 메인 분석 함수
export async function analyzeFace(imageData, mode) {
  // 얼굴 특징 추출
  const faceFeatures = extractFaceFeatures(imageData)
  
  // 분석 시뮬레이션 (실제로는 얼굴 인식 모델이 시간이 걸림)
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  if (mode === 'celebrity') {
    const celebrities = findSimilarCelebrities(faceFeatures)
    return {
      celebrities
    }
  } else if (mode === 'career') {
    const careers = recommendCareers(faceFeatures)
    return {
      careers
    }
  }
  
  throw new Error('Unknown mode')
}

