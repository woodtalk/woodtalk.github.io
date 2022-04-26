---
---
# 용어

- 행 수(cardianlity)
- 예상 행 수 vs 읽은 생 수 (vs 실제 행 수)
- 예상 실행 계획 / 실제 실행 계획

# oltp(OnLine Transaction Processing)

- 작은 범위
- index seek
- 램덤 io
- single cpu
- clustered index

# olap(OnLine Analytical Processing)

- 대량
- scan
- 순차 io
- 병령 처리
- nonclustered index

# page

- 저장소 기본 단위
- 8k

# heap / table scan / index seek/scan / covering(covered) index

## heap

- 인덱스(ci 포함)가 없는 테이블의 data pages
- 순서가 없음

## table scan

- 통짜 스캔 연산자 (ci 없음)

## index

- nonclustered index를 말함
- index도 테이블이라 고려해야 함
- root 부터 leaf1, leaf2, ..., heap

## index seek

- root page부터 leaf level까지 찾음

### RID(Row ID) Lookup + (Join)

- row id로 데이터가 있는 페이지를 찾기

## index scan

- 랜덤 io가 아닌 걍 스캔

## covering index

- select 컬럼을 인덱스만 설정할 경우
- index page(leaf level)만 데이터 엑세스하고 땡
- lookup 과정이 없음

## clustered index

- heap == leaf level인 경우
- 테이블 당 한개만 허용(대부분)
- PK에서 사용하는 편
