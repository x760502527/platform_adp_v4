import React from 'react';
import { Modal } from 'antd';

interface UpdateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { modalVisible, onCancel } = props;

  return (
    <Modal
      bodyStyle={{padding:'0px 24px'}}
      width={866}
      destroyOnClose
      title="修改租户信息"
      visible={modalVisible}
      onCancel={() => onCancel()}
    >
      {props.children}
    </Modal>
  );
};

export default UpdateForm;
