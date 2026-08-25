import type { DictionaryPhrase } from '../models'

export const phrases: DictionaryPhrase[] = [
  // Basics
  { id: 'ph-01', category: 'Basics', english: 'Hello', korean: '안녕하세요', pronunciation: 'Annyeonghaseyo' },
  { id: 'ph-02', category: 'Basics', english: 'Thank you', korean: '감사합니다', pronunciation: 'Gamsahamnida' },
  { id: 'ph-03', category: 'Basics', english: 'Yes', korean: '네', pronunciation: 'Ne' },
  { id: 'ph-04', category: 'Basics', english: 'No', korean: '아니요', pronunciation: 'Aniyo' },
  { id: 'ph-05', category: 'Basics', english: 'Excuse me', korean: '저기요', pronunciation: 'Jeogiyo' },
  { id: 'ph-06', category: 'Basics', english: 'Sorry', korean: '죄송합니다', pronunciation: 'Joesonghamnida' },

  // Restaurant
  { id: 'ph-07', category: 'Restaurant', english: 'One please', korean: '하나 주세요', pronunciation: 'Hana juseyo' },
  { id: 'ph-08', category: 'Restaurant', english: 'Water please', korean: '물 주세요', pronunciation: 'Mul juseyo' },
  { id: 'ph-09', category: 'Restaurant', english: 'Is this spicy?', korean: '이거 매워요?', pronunciation: 'Igeo maewoyo?' },
  {
    id: 'ph-10',
    category: 'Restaurant',
    english: 'Not spicy please',
    korean: '안 맵게 해주세요',
    pronunciation: 'An maepge haejuseyo',
  },
  {
    id: 'ph-11',
    category: 'Restaurant',
    english: 'The bill please',
    korean: '계산서 주세요',
    pronunciation: 'Gyesanseo juseyo',
  },
  { id: 'ph-12', category: 'Restaurant', english: 'Delicious', korean: '맛있어요', pronunciation: 'Masisseoyo' },
  {
    id: 'ph-13',
    category: 'Restaurant',
    english: 'For two people',
    korean: '두 명이요',
    pronunciation: 'Du myeongiyo',
  },
  {
    id: 'ph-14',
    category: 'Restaurant',
    english: 'Can we sit here?',
    korean: '여기 앉아도 돼요?',
    pronunciation: 'Yeogi anjado dwaeyo?',
  },

  // Café
  {
    id: 'ph-15',
    category: 'Café',
    english: 'Iced americano please',
    korean: '아이스 아메리카노 주세요',
    pronunciation: 'Aiseu amerikano juseyo',
  },
  { id: 'ph-16', category: 'Café', english: 'Hot please', korean: '뜨거운 걸로 주세요', pronunciation: 'Tteugeoun geollo juseyo' },
  { id: 'ph-17', category: 'Café', english: 'For here', korean: '여기서 먹을게요', pronunciation: 'Yeogiseo meogeulgeyo' },
  { id: 'ph-18', category: 'Café', english: 'To go', korean: '포장이요', pronunciation: 'Pojangiyo' },
  { id: 'ph-19', category: 'Café', english: 'Do you have wifi?', korean: '와이파이 있어요?', pronunciation: 'Waipai isseoyo?' },

  // Airport
  {
    id: 'ph-20',
    category: 'Airport',
    english: 'Where is the gate?',
    korean: '게이트가 어디예요?',
    pronunciation: 'Geiteuga eodiyeyo?',
  },
  {
    id: 'ph-21',
    category: 'Airport',
    english: 'I have a connecting flight',
    korean: '환승이에요',
    pronunciation: 'Hwanseungieyo',
  },
  {
    id: 'ph-22',
    category: 'Airport',
    english: 'Where is baggage claim?',
    korean: '수하물은 어디서 찾아요?',
    pronunciation: 'Suhamureun eodiseo chajayo?',
  },
  { id: 'ph-23', category: 'Airport', english: 'Where is the exit?', korean: '출구가 어디예요?', pronunciation: 'Chulguga eodiyeyo?' },

  // Taxi
  {
    id: 'ph-24',
    category: 'Taxi',
    english: 'To this address please',
    korean: '이 주소로 가주세요',
    pronunciation: 'I jusoro gajuseyo',
  },
  { id: 'ph-25', category: 'Taxi', english: 'How much is it?', korean: '얼마예요?', pronunciation: 'Eolmayeyo?' },
  {
    id: 'ph-26',
    category: 'Taxi',
    english: 'Please stop here',
    korean: '여기서 세워주세요',
    pronunciation: 'Yeogiseo sewojuseyo',
  },
  {
    id: 'ph-27',
    category: 'Taxi',
    english: 'Please use the meter',
    korean: '미터기 켜주세요',
    pronunciation: 'Miteogi kyeojuseyo',
  },

  // Shopping
  { id: 'ph-28', category: 'Shopping', english: 'How much is this?', korean: '이거 얼마예요?', pronunciation: 'Igeo eolmayeyo?' },
  {
    id: 'ph-29',
    category: 'Shopping',
    english: 'Do you have this in another size?',
    korean: '다른 사이즈 있어요?',
    pronunciation: 'Dareun saijeu isseoyo?',
  },
  {
    id: 'ph-30',
    category: 'Shopping',
    english: 'Can I try this on?',
    korean: '입어봐도 돼요?',
    pronunciation: 'Ibeobwado dwaeyo?',
  },
  {
    id: 'ph-31',
    category: 'Shopping',
    english: 'Tax refund please',
    korean: '택스 리펀 해주세요',
    pronunciation: 'Taekseu ripeon haejuseyo',
  },
  {
    id: 'ph-32',
    category: 'Shopping',
    english: 'Just looking, thank you',
    korean: '그냥 구경할게요',
    pronunciation: 'Geunyang gugyeonghalgeyo',
  },
]
