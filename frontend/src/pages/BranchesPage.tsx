import { useState, useEffect } from 'react';
import { Button, Space, Tag, message, Typography, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, StarOutlined, StarFilled, DashboardOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { branchService } from '../services/branch.service';
import type { Branch } from '../types';
import { DataTable } from '../components/DataTable';
import { FormModal, Form, Input, Row, Col } from '../components/FormModal';

const { Title } = Typography;

export default function BranchesPage() {
    const navigate = useNavigate();
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        setLoading(true);
        try {
            const response = await branchService.getAll();
            if (response.success && response.data) {
                setBranches(response.data);
            }
        } catch (error) {
            message.error('فشل تحميل الفروع');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingBranch(null);
        form.resetFields();
        form.setFieldsValue({ is_active: true });
        setModalVisible(true);
    };

    const handleEdit = (branch: Branch) => {
        setEditingBranch(branch);
        form.setFieldsValue(branch);
        setModalVisible(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await branchService.delete(id);
            message.success('تم حذف الفرع بنجاح');
            fetchBranches();
        } catch (error: any) {
            message.error(error.response?.data?.message || 'فشل حذف الفرع');
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (editingBranch) {
                await branchService.update(editingBranch.id, values);
                message.success('تم تحديث الفرع بنجاح');
            } else {
                await branchService.create(values);
                message.success('تم إضافة الفرع بنجاح');
            }
            setModalVisible(false);
            fetchBranches();
        } catch (error) {
            message.error('فشل حفظ الفرع');
        }
    };

    const handleSetMain = async (id: number) => {
        try {
            await branchService.setMain(id);
            message.success('تم تعيين الفرع الرئيسي بنجاح');
            fetchBranches();
        } catch (error) {
            message.error('فشل تعيين الفرع الرئيسي');
        }
    };

    const columns: ColumnsType<Branch> = [
        {
            title: 'الكود',
            dataIndex: 'code',
            key: 'code',
            width: 100,
            render: (code) => <strong style={{ color: '#1890ff', fontFamily: 'monospace' }}>{code}</strong>,
        },
        {
            title: 'اسم الفرع',
            dataIndex: 'name',
            key: 'name',
            render: (name, record) => (
                <Space>
                    {record.is_main && <StarFilled style={{ color: '#faad14' }} />}
                    <span style={{ fontWeight: record.is_main ? 600 : 500 }}>{name}</span>
                </Space>
            ),
        },
        {
            title: 'الاسم بالإنجليزية',
            dataIndex: 'name_en',
            key: 'name_en',
            render: (name_en) => name_en || '-',
        },
        {
            title: 'المدينة',
            dataIndex: 'city',
            key: 'city',
            render: (city) => city || '-',
        },
        {
            title: 'الهاتف',
            dataIndex: 'phone',
            key: 'phone',
            render: (phone) => phone || '-',
        },
        {
            title: 'الحالة',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (is_active) => (
                <Tag
                    color={is_active ? 'success' : 'error'}
                    style={{ fontSize: 13, padding: '4px 12px', borderRadius: 6, fontWeight: 500 }}
                >
                    {is_active ? 'نشط' : 'غير نشط'}
                </Tag>
            ),
        },
        {
            title: 'الإجراءات',
            key: 'actions',
            width: 220,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="text"
                        icon={<DashboardOutlined />}
                        onClick={() => navigate(`/branches/${record.id}/dashboard`)}
                        style={{ color: '#1890ff' }}
                        title="Dashboard"
                    />
                    {!record.is_main && (
                        <Button
                            type="text"
                            icon={<StarOutlined />}
                            onClick={() => handleSetMain(record.id)}
                            style={{ color: '#faad14' }}
                            title="تعيين كفرع رئيسي"
                        />
                    )}
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        style={{ color: '#52c41a' }}
                    />
                    {!record.is_main && (
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record.id)}
                        />
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
                <Title level={2} style={{ margin: 0 }}>إدارة الفروع</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                    size="large"
                >
                    إضافة فرع جديد
                </Button>
            </div>

            <DataTable
                columns={columns}
                dataSource={branches}
                rowKey="id"
                loading={loading}
                showSearch={false}
                onRefresh={fetchBranches}
                pagination={false}
            />

            <FormModal
                title={editingBranch ? 'تعديل بيانات الفرع' : 'إضافة فرع جديد'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={handleSubmit}
                form={form}
                width={800}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="اسم الفرع"
                            rules={[{ required: true, message: 'الرجاء إدخال اسم الفرع' }]}
                        >
                            <Input placeholder="مثال: الفرع الرئيسي" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="name_en" label="الاسم بالإنجليزية">
                            <Input placeholder="Main Branch" dir="ltr" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="address" label="العنوان">
                            <Input.TextArea rows={2} placeholder="العنوان التفصيلي" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="city" label="المدينة">
                            <Input placeholder="القاهرة" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="phone" label="الهاتف">
                            <Input dir="ltr" placeholder="+20 123 456 7890" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="email" label="البريد الإلكتروني">
                            <Input dir="ltr" placeholder="branch@company.com" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="is_active" label="الحالة" valuePropName="checked">
                            <Switch checkedChildren="نشط" unCheckedChildren="غير نشط" />
                        </Form.Item>
                    </Col>
                </Row>
            </FormModal>
        </div>
    );
}
