이 프로젝트는 수기로 작성된 발신자와 수신자의 정보 (이름, 휴대폰 번호, 주소)가 포함된 사진을 받아 Excel 파일로 변환하는 Android 및 iOS 애플리케이션을 개발합니다.

## 기능

- **사진 촬영 및 업로드**: 사용자는 앱 내에서 직접 사진을 촬영하거나 갤러리에서 선택하여 업로드할 수 있습니다.
- **OCR (광학 문자 인식)**: 업로드된 사진에서 발신자와 수신자의 정보를 자동으로 추출합니다.
- **데이터 검증 및 수정**: 추출된 데이터를 사용자가 확인하고 필요한 경우 수정할 수 있습니다.
- **Excel 파일 생성**: 검증된 데이터를 기반으로 Excel 파일을 생성하고 다운로드할 수 있습니다.

## 사용 기술

- **Frontend (Android & iOS)**: React Native
- **Backend**: Firebase Functions, Google Cloud Vision API (OCR)
- **Database**: Firebase Firestore
- **Excel 파일 생성**: SheetJS 또는 유사 라이브러리

## 설치 및 실행

```bash
# 프로젝트 클론
git clone [프로젝트 저장소 주소]
cd [프로젝트 폴더]

# 의존성 설치
npm install # 또는 yarn install

# Firebase 프로젝트 설정
# Firebase 프로젝트를 생성하고 앱을 등록합니다.
# Firebase 설정 파일 (google-services.json for Android, GoogleService-Info.plist for iOS)을 프로젝트에 추가합니다.

# 환경 변수 설정
# .env 파일에 필요한 환경 변수를 설정합니다. (예: Google Cloud Vision API Key)
cp .env.example .env

# 앱 실행
npm run android # 또는 npm run ios
```

## 기여

기여를 환영합니다! 풀 리퀘스트를 보내기 전에 이슈를 통해 변경 사항에 대해 논의해주세요.

## 라이선스

이 프로젝트는 [라이선스 종류] 라이선스 하에 배포됩니다.
