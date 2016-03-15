export function user_should_see_message(browser, assertMessage) {
  return browser
  .wait('.notif-container')
  .evaluate(() => {
    return document.querySelector('.notif-container').textContent
  }).then(message => {
    assertMessage(message)
  })
}
