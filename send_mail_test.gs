/**
 * フォームの回答者にメールを送信する
 * 
 * この関数をトリガーに登録し、フォーム送信時に実行されるよう設定することで、
 * フォームへの自動返信を行うことができます
 * トリガーへの登録方法は 「googleフォーム 返信 変える スクリプト」 みたいな感じで検索して頑張ってください
 * 
 * 義務教育レベルのプログラミング知識があればやりとげられると思いますが、
 * 自分の時代にはそういう授業はなかったので確信は持てません
 * 
 * 注意: フォームの全ての質問を必須にするのを忘れないでください
 *      回答されなかった質問は event.response.getItemResponses() の中身に入らないようなので
 *      回答の入っている index が変わってしまいます
 *      つまり、3つ目の質問の結果を取り出そうとしたら2つ目のものだった、みたいなことになって、まともに動きません
 * 
 * @param event https://developers.google.com/apps-script/guides/triggers/events?hl=ja#events の
 *              "Google フォームのイベント" - "フォームの送信" イベントの情報が格納されている
 */
function sendMail(event) {

  // メールアドレスを取得
  const mailAddress = event.response.getRespondentEmail();
  if (mailAddress == null) {
    throw new Error("メールアドレスが取得できません。フォームの設定「メールアドレスを収集する」を確認してください。");
  }

  // 回答を取り出す
  // responses[n] には (n-1) 個目の質問の結果が入っている
  const responses = event.response.getItemResponses();
  // 件名を作成
  const subject = makeSubject(responses);
  // 本文を作成
  const body = makeBody(responses);
  // メールを送信
  GmailApp.sendEmail(mailAddress, subject, body);
}

/**
 * 返信メールの件名を作成する
 * 
 * @param {ItemResponse[]} responses 回答内容
 * @returns {string} 返信メールの件名
 */
function makeSubject(responses) {
  return "TODO: 件名を入力してください";
}

/**
 * 返信メールの本文を作成する
 * 
 * @param {ItemResponse[]} responses 回答内容
 * @returns {string} 返信メールの本文
 */
function makeBody(responses) {
  // ラジオボタン
  const radioButtonResponse = responses[0].getResponse();
  let radioButtonMessage;
  switch (radioButtonResponse) {
    case "選択肢 1":
      radioButtonMessage = "1つ目の選択肢が選ばれました。";
      break;
    case "選択肢 2":
      radioButtonMessage = "2つ目の選択肢が選ばれました。";
      break;
    case "選択肢 3":
      radioButtonMessage = "3つ目の選択肢が選ばれました。";
      break;
  }

  // チェックボックス
  const checkBoxResponse = responses[1].getResponse();
  let checkBoxMessage = `選択されたチェックボックス: ${checkBoxResponse.join(", ")}`;

  // プルダウン
  // ラジオボタンと同じなので場合分けは省略
  const pullDownResponse = responses[2].getResponse();

  // テキストを結合して本文を作成する
  const body = `\
ラジオボタン:
${radioButtonMessage}
チェックボックス:
${checkBoxMessage}
プルダウン:
${pullDownResponse} が選ばれました。
`;

  return body;
}

class DummyResponse {
  /**
   * @param {string[]} responses 回答
   */
  constructor(response) {
    this.response = response;
  }

  getResponse() {
    return this.response;
  }
}

/**
 * この関数 ("debug") を指定して、上部メニューの「実行」をクリックすると、
 * メールの返信内容を確かめることができます
 * answers は自分のフォームに合わせて書き換えてください
 */
function debug() {
  // "選択肢 3" みたいなやつを、確かめたい選択肢の文章に書き換えてください
  const answers = [
    // 1つ目の質問 (ラジオボタン) の回答
    "選択肢 3",
    // 2つ目の質問 (チェックボックス) の回答 配列 [] で指定
    ["選択肢 2", "選択肢 3"],
    // 3つ目の質問 (プルダウン) の回答
    "選択肢 3",
    // 4つ目以降もあれば適宜追加 
  ]

  const responses = answers.map(x => new DummyResponse(x));
  const subject = makeSubject(responses);
  const body = makeBody(responses);
  console.log(`\
========== 件名 ==========
${subject}
========== 本文 ==========
${body}
`);
}
