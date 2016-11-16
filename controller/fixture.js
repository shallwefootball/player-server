
/**
 * 사용자가 lineup으로는 등록되었지만 기록이 되지않으 매치를 가져옵니다.
 * @param {int} userId
 */
exports.getUnrecordedMatches = (req, res) => {
  return res.json({
    message: 'success'
  })
}