const ComplaintsReport = () => import(/* webpackChunkName: "group-main" */ '@/views/ComplaintsReport/ComplaintsReport')
const Feedback = () => import(/* webpackChunkName: "group-main" */ '@/views/ComplaintsReport/Feedback')

export default {
  ComplaintsReport: ComplaintsReport, // 投诉举报页面
  Feedback: Feedback // 意见反馈
}
