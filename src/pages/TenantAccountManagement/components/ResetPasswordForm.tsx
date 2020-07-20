import React from 'react';
import { Modal } from 'antd';
// 定义重置密码的字段
interface ResetPasswordFields {
  usercode: string;
  pwd: string;
  newPwd: string;
}
// 定义组件接收的props接口
interface ReactPasswordProps {
  modalVisible: boolean;
  onCancel: () => void;
  // formData: any;
  onSubmit: () => void;
}
const ReactPasswordForm: React.FC<ReactPasswordProps> = (props) => {
  const { modalVisible, onCancel } = props;

  return (
    <Modal
      centered
      destroyOnClose
      title="点击重置密码"
      visible={modalVisible}
      onCancel={() => onCancel()}
      onOk={() => {props.onSubmit()}}
    >
      {props.children}
    </Modal>
  );
};

export default ReactPasswordForm;
