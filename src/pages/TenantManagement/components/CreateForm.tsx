import React from 'react';
import { Modal } from 'antd';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel } = props;

  return (
    <Modal
      bodyStyle={{padding:'0px 24px'}}
      width={866}
      destroyOnClose
      title="新增租户"
      visible={modalVisible}
      onCancel={() => onCancel()}
    >
      {props.children}
    </Modal>
  );
};

export default CreateForm;
