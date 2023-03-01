import { notification } from "antd";
export default function useNotification(
  placement = "bottomRight",
  auditState,
  noteText
) {
  return notification.info({
    message: `通知`,
    description: `你可以到${
      noteText ? noteText : auditState === 0 ? "草稿箱" : "审核列表"
    }中查看新闻`,
    placement,
  });
}
