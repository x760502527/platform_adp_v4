import React from 'react';
import {Modal} from 'antd';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel} = props;
  return (
    <Modal
      width={984}
      destroyOnClose
      title="创建版本"
      onCancel={onCancel}
      visible={modalVisible}
      footer={null}
    >
      {props.children}
    </Modal>
  );
};
export default CreateForm;
