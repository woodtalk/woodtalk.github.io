---
---
# git에 대한 잡다한 지식

## merge와 rebase의 차이점

- merge는 branch를 묶는 것
- rebase는 branch를 commit(or branch)에 얹는 것

## 유용한 정보

### .git/info/exclude 그리고 attributes

살다보면 플젝에 쪼랩으로 들어와 commit 하나가 살 떨릴 때가 있다.

`.gitignore`가 이미 커밋되어 있어 내 개인적으로 쓰는 임시 파일들(예를 들면 swp라던지...ㅠㅠ)을 ignore하고 싶은데,   
`.gitignore`에 넣기 애매한 경우가 있다.

git은 정말 좋은 녀석이므로 이 부분을 해결하였는데,   
`.git/info` 폴더를 보면 `exclude`파일이 있다.   
요 파일은 `.gitignore`와 동일 효력을 같지만 push되지 않는 local 파일이다.

사용법도 `.gitignore`와 같으니 잘 써먹어 보자.

자매품으로 `.gitattributes`를 대체 할 `attributes` 파일도 있다.

### git에서 clone 및 pull에서 자꾸 `^M`(carriage returns)을 붙혀서 배포한다?

`.gitattributes`에 다음을 넣어 커밋하자

```
*.sh text eol=lf
```

### 이미 커밋되었어요. ignore가 하고 싶어요.

git 명령어 중 안 알려진 명령어 `update-index`(`ls-files` 등)를 이용하자.   
간단한 사용예만 정리한다.

```bash
git ls-files -v | grep ^S
git update-index --skip-worktree <파일명>
git update-index --no-skip-worktree <파일명>
```

### author나 committer 정보를 일괄적으로 변경하고 싶을 때

```bash
#!/bin/sh

git filter-branch --env-filter '

OLD_EMAIL="your-old-email@example.com"
CORRECT_NAME="Your Correct Name"
CORRECT_EMAIL="your-correct-email@example.com"

if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags
```

참고 [[https://help.github.com/en/articles/changing-author-info]]

### git log alias(color highlight)

```
git config --global alias.lg "log --pretty=format:'%C(auto)%h %ai %Creset%C(auto,bold blue)<%an>%Creset%C(auto) -%d %s %Creset%C(auto,green)(%cr)%Creset' --graph --all"
```

- `--stat` : 변경 파일 목록 표기
- `-p` : 파일 변경 diff까지 보기
- `-{숫자}`(`-2`) : log 목록 제한

참고 [[https://coderwall.com/p/euwpig/a-better-git-log]]

#### git diff(log -p 옵션에서도 사용가능)에서 유용한 옵션

```bash
--word-diff
```

## git-svn

git-svn은 svn을 쓰는 프로젝트에 꿈과 같은 명령어라고 할 수 있다.   
다면 초기 설정이 그지 같아서 문제다.

`.git/config`를 저장하여 유지를 시키면 안심   
git config가 무엇인지 svn은 어떻게 연결시키는 것이 덜 혼란스러운지 기타 잡 스킬에 대해 알아보자.

### git config

git 프로젝트?에 로컬적인 각종 설정파일   
여러 옵션들이 있지만 여기에서는 `[svn-remote "svn"]`만 다루겠다.

### git-remote 하위 주요 옵션

- svn-remote 옆에 있는 `"svn"`의미
  + 해당 string이 svn이면 `git svn fetch` 등에서 그냥 default로 생략 가능한 이름이다.
  + svn외 다른 이름을 쓰면 `git svn fetch somebody-help-me` 요런 식으로 쓸 수 있는데 `[svn-remote "somebody-help-me"]`이 아래에 설정된 url 및 fetch들만 실행된다.
- url
  + svn repo의 url
  + url만 쓰는게 (trunk 직전 path)만 쓰는 게 유리
- fetch
  + `git svn fetch` 명령으로 땡겨올 수 있는 path들
  + 여러개를 써도 된다.
- branches/tags
  + fetch는 1:1로만 쓸 수 있어 branch를 fetch로 적용할 경우 애로사항이 꽃핀다.
  + 때문에 branches(혹은 tags)가 있다.

자세한 사용법은 아래를 참고

```gitconfig
[svn-remote "svn"]
	url = http://localhost/svn
	#url은 trunk or branch 폴더 전까지 써주는 게 좋다.
	#나중 refs의 root가 되는 위치이니 유념

	fetch = trunk/main-category/some-project:refs/remotes/svn/trunk
	# fetch의 : 왼쪽은 url다음 path를 뜻함
	# fetch의 : 오른쪽은 git에서 쓸 branch path(와 name)을 뜻함
	# refs/remotes는 원격지 branch 표시를 위한 prefix라고 생각하면 편함

	fetch = branches/special/some-category/branch-name-1/main-category/some-project:refs/remotes/svn/branches/branche-name-1
	# 위 같이 쓰면 http://localhost/svn/branches/special/some-category/branch-name-1/main-category/some-project 를
	# git의 remotes/svn/branches/branche-name-1 로 연결하여 관리하게 만듬
	# 때문에 branch-name-2 ...3 등등 있으면 다 써줘야하는데 문제가 심각함.

	branches = branches/*/*/main-category/some-project:refs/remotes/svn/branches/*/*
	# 요거 찾니라 겁나 시간 걸림
	# //사이에는(하나의 단어) *는 한개만
	# git branch 위치 끝에는 무조건 * 찍어야함
	# * 표기를 차례로 git branch에 매칭시켜줌. 오 갓
```

특히 branches의 **규칙** 은 공식 홈페이지에서도 자세히 다룬다.   
[[https://git-scm.com/docs/git-svn]] 에 CONFIGURATION 항목에 보면 언급되니 참고

### git-svn으로 커밋들 땡겨올 때 author의 email 주소가 hashing이 붙어서 시무륵

`.git/config`에 `svn.authorsProg`라는 게 있다.

```gitconfig
[svn]
  authorsProg = .git/info/change-author-company-email.sh
```

아래는 `.git/info/change-author-company-email.sh` 파일 내용이다.   
`.git/info`에 해당 스크립트를 넣는 이유는 `exclude` 등 개인적인 옵션 파일들이 거기에 있어 ln(mklink) 등으로 별도로 관리하는 편이므로... 편의에 의해

```bash
echo "$1 <$1@gmail.com>"
```

추가적으로 `svn.authorsfile`이라는 옵션도 있으니 참고 바람

### git-svn 주요 명령어

- `git svn fetch`
- `git svn dcommit`

말고는 쓰지도 보지도 말자

#### git svn fetch 에서 특정 리비전부터 땡기는 법

`git svn fetch -r1234:HEAD`

HEAD는 꼭 대문자로

