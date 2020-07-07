import React from 'react';
import { Modal } from 'antd';
// 定义组件接收的props接口
interface ReactPasswordProps {
  modalVisible: boolean;
  onCancel: () => void;
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
      onOk={() => {onCancel()}}
    >
      {props.children}
    </Modal>
  );
};

export default ReactPasswordForm;
