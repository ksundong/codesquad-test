# codesquad-test

2020년도 마스터즈 코스 테스트 수행용 git repository<br>
가상 야구 게임의 점수판을 구현한다.<br>
각 단계별로 구현한 코드 동작에 대해 README.md에 정리한다.

## Step 1

1. 게임이 시작되면 "첫 번째 타자가 타석에 입장했습니다." 메시지와 함께 경기를 진행한다.<br>
   start라는 이름의 function을 선언하여 start가 실행되었을 때, 메시지를 출력하고 경기를 진행한다.<br>
   경기를 진행하는 것도 함수로 처리하는 편이 좋을 것 같아 playgame이라는 함수를 만들어 주었다.

2. 경기가 진행되면 랜덤하게 스트라이크 / 볼 / 안타 / 아웃 네 가지 중 한 결과가 출력된다.<br>
   playgame 함수가 실행되었을 때, randomResult라는 위의 네 가지 중 한 결과를 출력하는 함수를 만들었다.<br>
   출력 예시를 참고하여, 신나는 야구 게임!을 최초에 출력하도록 수정하였다.

3. 2번의 결과의 아래 줄에 누적된 스트라이크(S), 볼(B), 아웃(O) 상황을 출력한다.<br>
   상태를 관리하기 위해 status라는 객체를 생성하였다. toString 메소드로 상태를 출력한다.<br>
   난수의 값에 따라 상태를 업데이트 하는 updateStatus함수를 추가하였다.<br>
   난수를 변수로 두고 result 변수를 제거하였다.<br>

4. 스트라이크가 3회 누적되면 1 아웃이다.<br>
   status업데이트 후 체크하는 checkStatus 함수를 생성하였다.<br>
   S가 3일 경우, 0으로 초기화하고, Out(O)의 개수를 높이도록 하였다.<br>

5. 볼이 4회 누적되면 1 안타가 된다.<br>
   4번과 같이 checkStatus 함수 내에서 처리하였다.<br>
   B가 4일 경우, 0으로 초기화하고, H의 개수를 높이도록 하였다.<br>

## Step 2

## Step 3
