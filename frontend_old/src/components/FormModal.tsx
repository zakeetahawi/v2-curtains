import { Modal, Form, Input, Select, DatePicker, InputNumber, Switch, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
import type { ReactNode } from 'react';

interface FormModalProps {
    title: string;
    open: boolean;
    onCancel: () => void;
    onOk: () => void;
    form: FormInstance;
    children: ReactNode;
    width?: number;
    okText?: string;
    cancelText?: string;
    loading?: boolean;
}

export function FormModal({
    title,
    open,
    onCancel,
    onOk,
    form,
    children,
    width = 800,
    okText = 'حفظ',
    cancelText = 'إلغاء',
    loading = false,
}: FormModalProps) {
    return (
        <Modal
            title={
                <div style={{
                    fontSize: 18,
                    fontWeight: 600,
                    paddingBottom: 16,
                    borderBottom: '2px solid #f0f0f0'
                }}>
                    {title}
                </div>
            }
            open={open}
            onCancel={onCancel}
            onOk={onOk}
            width={width}
            okText={okText}
            cancelText={cancelText}
            confirmLoading={loading}
            okButtonProps={{
                size: 'large',
                style: { minWidth: 100 }
            }}
            cancelButtonProps={{
                size: 'large',
                style: { minWidth: 100 }
            }}
            styles={{
                body: { paddingTop: 24 }
            }}
        >
            <Form
                form={form}
                layout="vertical"
                size="large"
                requiredMark="optional"
            >
                {children}
            </Form>
        </Modal>
    );
}

// Styled Form Components
export const FormSection = ({ title, children }: { title: string; children: ReactNode }) => (
    <div style={{ marginBottom: 24 }}>
        <div style={{
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 16,
            color: '#1890ff',
            borderRight: '3px solid #1890ff',
            paddingRight: 12
        }}>
            {title}
        </div>
        {children}
    </div>
);

export { Form, Input, Select, DatePicker, InputNumber, Switch, Upload, Button, UploadOutlined };
