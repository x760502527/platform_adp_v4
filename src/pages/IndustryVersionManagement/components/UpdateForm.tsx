import React from 'react';
import {Modal} from 'antd';

interface UpdateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { modalVisible, onCancel} = props;
  return (
    <Modal
      width={984}
      destroyOnClose
      title="修改版本"
      onCancel={onCancel}
      visible={modalVisible}
      footer={null}
    >
      {props.children}
    </Modal>
  );
};
export default UpdateForm;
