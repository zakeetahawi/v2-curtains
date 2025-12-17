import { useState, useEffect } from 'react';
import { Card, Typography, Tag, Space, Button, Table, Modal, Form, Input, Select, App } from 'antd';
import { PlusOutlined, UserOutlined, TeamOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { branchService } from '../services/branch.service';
import { userService } from '../services/user.service';
import type { Branch } from '../types';

const { Title } = Typography;

interface User {
    id: number;
    username: string;
    email: string;
    role_id: number;
    role?: {
        id: number;
        name: string;
    };
    branch_id?: number;
    branch?: Branch;
    is_active: boolean;
    created_at: string;
}

export default function UsersPage() {
    const { message } = App.useApp();
    const [users, setUsers] = useState<User[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchUsers();
        fetchBranches();
    }, [page]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userService.getAll(page, 10);
            if (response.success && response.data) {
                setUsers(response.data.users || []);
                setTotal(response.data.total || 0);
            }
        } catch (error) {
            message.error('فشل تحميل المستخدمين');
        } finally {
            setLoading(false);
        }
    };

    const fetchBranches = async () => {
        try {
            const response = await branchService.getAll();
            if (response.success && response.data) {
                setBranches(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch branches');
        }
    };

    const handleCreate = () => {
        setEditingUser(null);
        form.resetFields();
        form.setFieldsValue({ is_active: true, role_id: 3 });
        setModalVisible(true);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        form.setFieldsValue({
            username: user.username,
            email: user.email,
            role_id: user.role_id,
            branch_id: user.branch_id,
            is_active: user.is_active,
        });
        setModalVisible(true);
    };

    const handleDelete = async (id: number) => {
        Modal.confirm({
            title: 'هل أنت متأكد من حذف هذا المستخدم؟',
            content: 'لا يمكن التراجع عن هذا الإجراء',
            okText: 'نعم، احذف',
            cancelText: 'إلغاء',
            okButtonProps: { danger: true },
            onOk: async () => {
                try {
                    await userService.delete(id);
                    message.success('تم حذف المستخدم بنجاح');
                    fetchUsers();
                } catch (error) {
                    message.error('فشل حذف المستخدم');
                }
            },
        });
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            if (editingUser) {
                await userService.update(editingUser.id, values);
                message.success('تم تحديث المستخدم بنجاح');
            } else {
                await userService.create(values);
                message.success('تم إضافة المستخدم بنجاح');
            }
            setModalVisible(false);
            form.resetFields();
            fetchUsers();
        } catch (error: any) {
            if (error.errorFields) {
                message.error('الرجاء ملء جميع الحقول المطلوبة');
            } else if (error.response && error.response.data && error.response.data.message) {
                message.error(error.response.data.message);
            } else {
                message.error('فشل حفظ المستخدم');
            }
        }
    };

    const columns: ColumnsType<User> = [
        {
            title: 'الاسم',
            dataIndex: 'username',
            key: 'username',
            render: (text) => (
                <Space>
                    <UserOutlined style={{ color: '#1890ff' }} />
                    <strong>{text}</strong>
                </Space>
            ),
        },
        {
            title: 'البريد الإلكتروني',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'الدور',
            dataIndex: ['role', 'name'],
            key: 'role',
            render: (text, record) => {
                const roleNames: Record<number, string> = {
                    1: 'مدير النظام',
                    2: 'مدير',
                    3: 'موظف',
                };
                const roleName = text || roleNames[record.role_id] || 'موظف';
                const colors: Record<number, string> = {
                    1: 'red',
                    2: 'blue',
                    3: 'green',
                };
                return (
                    <Tag color={colors[record.role_id] || 'green'} style={{ fontSize: 13, padding: '4px 12px' }}>
                        {roleName}
                    </Tag>
                );
            },
        },
        {
            title: 'الفرع',
            dataIndex: ['branch', 'name'],
            key: 'branch',
            render: (text, record) => (
                <Space>
                    <TeamOutlined style={{ color: '#52c41a' }} />
                    {text || 'غير محدد'}
                    {record.branch?.is_main && <Tag color="gold">⭐ رئيسي</Tag>}
                </Space>
            ),
        },
        {
            title: 'الحالة',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (is_active) => (
                <Tag color={is_active ? 'success' : 'error'}>
                    {is_active ? 'نشط' : 'غير نشط'}
                </Tag>
            ),
        },
        {
            title: 'الإجراءات',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        تعديل
                    </Button>
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    >
                        حذف
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
                <Title level={2} style={{ margin: 0 }}>إدارة المستخدمين</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={handleCreate}
                >
                    مستخدم جديد
                </Button>
            </div>

            <Card>
                <Table
                    columns={columns}
                    dataSource={users}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        current: page,
                        total,
                        pageSize: 10,
                        onChange: setPage,
                        showSizeChanger: false,
                        showTotal: (total) => `إجمالي ${total} مستخدم`,
                    }}
                />
            </Card>

            <Modal
                title={editingUser ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}
                open={modalVisible}
                onOk={handleSubmit}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                }}
                okText="حفظ"
                cancelText="إلغاء"
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    style={{ marginTop: 20 }}
                >
                    <Form.Item
                        name="username"
                        label="اسم المستخدم"
                        rules={[{ required: true, message: 'الرجاء إدخال اسم المستخدم' }]}
                    >
                        <Input placeholder="أدخل اسم المستخدم" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="البريد الإلكتروني"
                        rules={[
                            { required: true, message: 'الرجاء إدخال البريد الإلكتروني' },
                            { type: 'email', message: 'الرجاء إدخال بريد إلكتروني صحيح' },
                        ]}
                    >
                        <Input placeholder="user@example.com" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="كلمة المرور"
                        rules={[
                            { required: !editingUser, message: 'الرجاء إدخال كلمة المرور' },
                            { min: 6, message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
                        ]}
                    >
                        <Input.Password
                            placeholder={editingUser ? 'اتركه فارغاً للإبقاء على كلمة المرور الحالية' : 'أدخل كلمة المرور'}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="role_id"
                        label="الدور"
                        rules={[{ required: true, message: 'الرجاء اختيار الدور' }]}
                    >
                        <Select placeholder="اختر الدور" size="large">
                            <Select.Option value={1}>مدير النظام</Select.Option>
                            <Select.Option value={2}>مدير</Select.Option>
                            <Select.Option value={3}>موظف</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="branch_id"
                        label="الفرع"
                        rules={[{ required: true, message: 'الرجاء اختيار الفرع' }]}
                    >
                        <Select placeholder="اختر الفرع" size="large">
                            {branches.map(branch => (
                                <Select.Option key={branch.id} value={branch.id}>
                                    {branch.name} {branch.is_main ? '⭐' : ''}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="is_active"
                        label="الحالة"
                        rules={[{ required: true, message: 'الرجاء اختيار الحالة' }]}
                    >
                        <Select placeholder="اختر الحالة" size="large">
                            <Select.Option value={true}>نشط</Select.Option>
                            <Select.Option value={false}>غير نشط</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
