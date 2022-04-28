---
---
# Variant (of Type)

- 변성이라고 번역되는 편 (변종이라고도 함)
- 변화하는 경향성? 느낌이 있는 듯 함
- 다음과 같은 용어가 있음
  + covariant : **공변성**
  + contravariant : 반공변성
  + bivariant
  + invariant(or nonvariant)

## 변성이란?

- `SuperType` ◁- `ExtendsType` 관계가 있다고 가정
- 이 두 type 의 **파생 타입** (generic, functor 등등) 들의 관계에 대한 정의

## 공변성

| 기본 관계                | 파생 관계                                                            |
|--------------------------|----------------------------------------------------------------------|
| SuperType ◁- ExtendsType | `Immutable.List<SuperType>` ◁- `Immutable.List<ExtendsType>`             |
| SuperType ◁- ExtendsType | `(): SuperType => SuperType()` ◁- `(): ExtendsType => ExtendsType()` |

- 기본 관계와 파생 관계가 같은 방향일 경우
- 일반적으로 `+` 기호; C#, typescript 에서는 `out` 로 표현
- out 이나 + 로 표현한 이유가 일반적으로 확장 타입이 더 넓은 기능?을 표현하는 경우가 많아 그렇지 않을까 생각함

## 공변성

| 기본 관계                | 파생 관계                                                        |
|--------------------------|------------------------------------------------------------------|
| SuperType ◁- ExtendsType | `(v: SuperType): void => { }` -▷ `(v: ExtendsType): void => { }` |

- 기본 관계와 파생 관계가 반대 반향일 경우
- 일반적으로 `-` 기호; C#, typescript 에서는 `in` 로 표현

## bivariant (& variant) & invariant

- bi- : SuperType ◁- ExtendsType, then `I<SuperType> ≡ I<ExtendsType>`
- variant: co or contra or bi
- in-(non-) : not variant
- invariant 용어는 컴퓨터 사이언스에서 겁나 좋아하는 용어이다.
  + <https://en.wikipedia.org/wiki/Invariant#Computer_science>

## 참고

- <https://en.wikipedia.org/wiki/Covariance_and_contravariance_(computer_science)>
- <https://edykim.com/ko/post/what-is-coercion-and-anticommunism/#g--animal---animal%EB%A1%9C-%EA%B0%80%EC%A0%95%ED%95%98%EB%A9%B4-fg%EB%8A%94-%ED%83%80%EC%9E%85-%EC%95%88%EC%A0%84%ED%95%9C%EA%B0%80>

# Liskov Substitution Principle

- SOLID 원칙에서 L 을 담당하는
- 그렇게 중요한지 모르겠지만, 이름에서도 무슨 의미인지 모르겠고
- 다른 원칙들은 덕담 느낌인데,
- 얘는 뭐 개념도 많이 들어있고 (수학적으로 증명된 부분도 있는 듯하고)
- 여튼 가성비가 안 맞는 원칙이다.

## 원칙

- 두 개체(혹은 모듈 혹은 타입)이 확장 관계의 상하 관계에 있다면,
- 하위 개체는 상위 개체의 계약 사항을 항상 충족해야 한다.
- 줄이자면 "상위 개체를 하위 개체로 치환하더라도, 동작에 문제가 없어야 한다."

## 이 원칙의 효과로 다음과 같은 현상이 생긴다.

주어는 모두 하위 타입

### 메소드(특히 시그니처)

+ **파라메터** 는 **반공변성** 이다.
  - Contravariance of method parameter types in the subtype.
+ **return 타입** 은 **공변성** 이다.
  - Covariance of method return types in the subtype.
+ 새로운 **exception** (상위에 없는) 은 사용할 수 없다.
  - New exceptions cannot be thrown by the methods in the subtype...

### 행동 조건

+ 사전 조건 강화 안됌
  - Preconditions cannot be strengthened in the subtype.
  - 로직 실행 전 validation : 사전 조건
+ 후속 조건 약화 안됌
  - Postconditions cannot be weakened in the subtype.
  - 로직 실행 후 결과 값 validation : 후속 조건
+ 상위가 지킨 (상위 상태의) 불변식(불변속성)은 하위가 지켜줘야함
  - Invariants must be preserved in the subtype.
  - 여기서 invariant 는 The C++ Programming Language, Effective C++ 에서 설명하는 용어로 봐야 한다.
    + <https://en.wikipedia.org/wiki/Invariant_(mathematics)#Invariants_in_computer_science>
  - invariant: 유효한 상태를 규정하는 조건 혹은 그 조건을 점검하는 코드
+ History constraint (the "history rule")...
  - 히스토리 제약조건: 상위에서 정의 불가한 히스토리(ex> method call history 등)가 하위에서 정의 되어선 안 된다.
    + 상위 상태를 변경하려면, 상위 히스토리를 사용해야 한다.
    + 상태 변경은 객체 자신의 메소드로만 변경하여야 한다.
  - 다양한 해석들이 있고(mutable, immutable 등) 다른 예시도 있었으나, 이 정도로 정의하는 것이 맞다고 생각함

## 참고

- <https://en.wikipedia.org/wiki/Liskov_substitution_principle>
- <https://pizzasheepsdev.tistory.com/9>
- <https://m.blog.naver.com/salinokl/221053934445>
- <https://banaba.tistory.com/34>
