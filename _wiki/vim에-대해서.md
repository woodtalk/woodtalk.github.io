---
---
# vi 단축키 관련

## insert mode에서...

- ctrl + [ 은 esc
- ctrl + h 은 backspace
- ctrl + w 은 이전 단어 지우기

## 그냥 모드에서 insert mode로 전환하는 다양한 방법

- i : 현재 커서에서 insert
- a : 현재 커서 다음 글자에서 insert
- I : 줄 앞단에서 insert
- A : 줄 맨 끝에서 insert
- o : 현재 커서의 아래 쪽에 줄 추가 후 insert
- O : 현재 커서의 윗 쪽에 줄 추가 후 insert

## 빨리 이동하기 위한 팁

- f문자 : 문자의 위치로 이동 ; 를 누르면 계속 이동
- F문자 : 백워드로 문자의 위치로 이동
- e or w : 단어 단위 앞으로 이동
- b : 단어 단위 뒤로 이동
- t문자 : 문자의 앞위치로 이동
- T문자 : 백워드방향으로 문자의 앞위치로 이동

## clipboard / registers 관련 팁

- `"{$character}y` : {$character}에 clipboard에 저장함
- `"{$character}p` : {$character}에 clipboard에 저장된 값 paste
- 명령어 모드에서 `:reg`는 현재 등록(regist)된 모든 clipboard 값을 확인할 수 있음

### command / search mode에서 붙여넣기 하고 싶을 때

ctrl + r 다음에 클립보드 종류를 선택할 수 있는데,   
아래와 같은 상태가 된다.

```vim
:"
/"
```

다음과 같이 클립보드를 선택할 수 있다.

- `0` ~ `9` : 대표적으로 0을 사용하며 최근에 yank 했던 내용(vim)
- `"` : 이전 yank 했던 내용 - 이건 정확하지 않을 수 있음
- `:` or `/` : 방금 command or search에서 사용했던 내용
- `+` : **핵** **중요**. command mode나 search mode에서 외부(ctrl + c)에서 복사한 내용을 붙힐 때 사용

### 이건 예전에 참고용으로 남기는 내용
- visual mode에서 복사(y)한 내용을 search mode(/)에서 사용하는 방법은 ctrl + r + 0를 하면 된다.
- ctrl + r에는 기타 다른 것도 사용할 수 있다. % # / : 등등
- 기타 자세한 내용은 :help c_CTRL-R로 알 수 있다.
  + 출처 : <http://seorenn.blogspot.kr/2011/04/vim.html?m=1>

## 만약에 binary로 파일을 보고 싶으면

```vim
:%!xxd
```

다시 reverse하려면(되돌리려면)

```vim
:%!xxd -r
```

추가로 `setlocal binary`나 `setlcoal diplay=uhex` , `setlocal wrap` 기타 등등이 있는데 자세한 건 <http://vim.wikia.com/wiki/Hex_dump> 참조

## 인코딩이 변경하고 싶다

```vim
:e ++enc=\현재 파일 encoding\
:w ++enc=\변경할 파일 encoding\
```

현재 파일의 인코딩 확인은

```vim
set fenc
```

vim에서 파일을 읽을 때 인코딩 우선순위 설정 및 확인은

```vim
set fileencoings
```

추가로

```vim
:set bomb
:set nobomb
```

위의 명령으로 BOM을 추가 제거할 수 있다.

## JSON pretty formatting

```vim
:%!python -m json.tool
```

추가로 현재 특정 파일로 syntax변경하여 보고 싶으면

```vim
:set syntax=json
```

## `^M`(carriage returns)을 확인하고 싶다?

```vim
:e ++ff=unix
:e ++fileformat=unix
```

## `^M`(carriage returns)을 제거하고 싶다?

```vim
:%s/^M//g
:%s/{ctrl+v}{ctrl+m}//g
```


## PO **매크로** WER

- vim을 사용하려고 열시미 노력한지 어언 2년 쯤 드디어 매크로의 세계에 첫발을 디딘다.
- `q[매크로 명]` 이렇게 하면 레코딩이 시작된다.
  + 예를 들어 `qa`라고 했으면 a로 매크로가 기록되기 시작한다.
- 레코딩 중인 매크로를 끝마치려면 `q`로 끝마친다.
- 매크로 중 숫자를 증감 시키려면 숫자에 커서를 위치 시킨 후 `ctrl + a`(증가), `ctrl + x`(감소)를 누르면 된다.
  + 단, 커서를 이동 시킬 때 f나 /로 숫자를 찾지 말자 (숫자 값이 변경되지 않나)
- 매크로를 저장 했으면 매크로를 실행하려고 하는 위치에 커서를 잘 놓고 `@[매크로 명]`을 누르면 된다.
  + `qa`로 저장했다면 `@a`
- 매크로를 여러번 실행하고 싶으면 `[횟수]@[매크로 명]`같이 입력해 주면 됨
- <http://forcecore.tistory.com/1255> 는 매크로를 아예 저장하는 방법이 있네

## 대소문자 관련해서

- 선택 범위 모두 대문자 : U
- 선택 범위 모두 소문자 : u
- 선택 범위 모두 대소문자 반전 : ~
- 찾기 바꾸기에서 특정 문자 대문자로 : `\U\1\E`
- 찾기 바꾸기에서 특정 문자 소문자로 : `\L\1\E`

## 찾기 패턴 반복(repeat)

```vim
%s/\v^!+/\=repeat('#',strlen(submatch(0)))/g
```

## command line list

급하게 명령어를 날리는 도중 이상하게 명령어 히스토리가 보일 때가 있는데

```vim
q:
```

이게 그 명령이다. 그래서 빨리 종료하려고 `:q`를 빨리 날리면 항상 명령어 히스토리가 보인다.   
이 명령은 커맨드 라인을 **copy** 할 때 유용하다.

## vimdiff 단축키

- 커서 이동
  + `[ + c` : *윗* 방향으로 이동
  + `] + c` : *아래* 방향으로 이동
- 복사 적용
  + `d + p` : 커서 *반대쪽* 에 복사
  + `d + o` : *커서쪽* 으로 복사
- 창
  + `Ctrl + w + w` or `Ctrl + w + 방향키` : 분할 화면 이동
  + `Ctrl + w =` : 분할 창 크기 동일
- 기타
  + `z + o` : 숨긴 부분 열기
  + `z + c` : 차이점 없는 부분 열기
  + `:diffupdate` : 차이점 비교 update

## 기타

- ctrl + v 를 할 경우 수평 선택이 가능하다.
- I는 그 상태에서 입력 가능 입력한 후 esc를 누르면 수평 입력이 가능하다.

### 유용한 자료

- vim에 대한 책이 있네요 - <https://blog.insightbook.co.kr/2011/03/29/%ec%bd%94%eb%94%a9%ec%9d%84-%ec%97%b0%ec%a3%bc%ed%95%98%eb%93%af-vim%ec%9d%84-%eb%b0%b0%ec%9b%8c%eb%b3%b4%ec%84%b8%ec%9a%94/>
- 그 중 마음에 드는 이미지 <https://insightbookblog.files.wordpress.com/2019/02/cfile21.uf_.15118c3f4d8c3a8f3b8f76.jpg>
  + 원본 <https://bitbucket.org/tednaleid/vim-shortcut-wallpaper/src/default/>
