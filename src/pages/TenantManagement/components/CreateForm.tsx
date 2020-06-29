import React from 'react';
import { Modal } from 'antd';

interface CreateFormProps {
  modalVisible: boolean;
  onOk: () => void;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel , onOk } = props;

  return (
    <Modal
      bodyStyle={{padding:'0px 24px'}}
      width={866}
      destroyOnClose
      title="新增租户"
      visible={modalVisible}
      onCancel={() => onCancel()}
      onOk={() => onOk()}
    >
      {props.children}
    </Modal>
  );
};

export default CreateForm;
