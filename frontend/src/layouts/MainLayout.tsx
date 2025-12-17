import { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, Button, Typography, Space } from 'antd';
import {
    DashboardOutlined,
    UserOutlined,
    ShoppingOutlined,
    InboxOutlined,
    ToolOutlined,
    BarChartOutlined,
    SettingOutlined,
    BellOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserSwitchOutlined,
    ApartmentOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { notificationService } from '../services/notification.service';
import { useAppStore } from '../store';
import { useNotifications } from '../utils/useNotifications';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export default function MainLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [notifDropdownVisible, setNotifDropdownVisible] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const user = useAppStore((state) => state.user);
    const notifications = useAppStore((state) => state.notifications);
    const unreadCount = useAppStore((state) => state.unreadCount);
    const markAsRead = useAppStore((state) => state.markAsRead);

    // Enable live notifications
    useNotifications();

    const menuItems = [
        { key: '/dashboard', icon: <DashboardOutlined />, label: 'لوحة التحكم' },
        { key: '/customers', icon: <UserOutlined />, label: 'العملاء' },
        { key: '/sales', icon: <ShoppingOutlined />, label: 'المبيعات' },
        { key: '/inventory', icon: <InboxOutlined />, label: 'المخزون' },
        { key: '/production', icon: <ToolOutlined />, label: 'الإنتاج' },
        { key: '/reports', icon: <BarChartOutlined />, label: 'التقارير' },
        { key: '/branches', icon: <ApartmentOutlined />, label: 'الفروع' },
        { key: '/users', icon: <TeamOutlined />, label: 'المستخدمين' },
        { key: '/settings', icon: <SettingOutlined />, label: 'الإعدادات' },
    ];

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            icon: <UserSwitchOutlined />,
            label: (
                <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{user?.username}</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {user?.email}
                    </Text>
                </div>
            ),
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'تسجيل الخروج',
            danger: true,
            onClick: () => authService.logout(),
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }} dir="rtl">
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    background: '#001529',
                }}
            >
                <div style={{
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <Text strong style={{ color: 'white', fontSize: collapsed ? 16 : 20 }}>
                        {collapsed ? 'ERP' : 'نظام ERP'}
                    </Text>
                </div>

                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={({ key }) => navigate(key)}
                    style={{ marginTop: 16 }}
                />
            </Sider>

            <Layout>
                <Header style={{
                    padding: '0 24px',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: 18 }}
                    />

                    <Space size="middle">
                        <Dropdown
                            open={notifDropdownVisible}
                            onOpenChange={setNotifDropdownVisible}
                            popupRender={() => (
                                <div style={{
                                    background: 'white',
                                    borderRadius: 8,
                                    boxShadow: '0 3px 6px -4px rgba(0,0,0,.12), 0 6px 16px 0 rgba(0,0,0,.08)',
                                    width: 360,
                                    maxHeight: 400,
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', fontWeight: 600 }}>
                                        الإشعارات ({unreadCount})
                                    </div>
                                    <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                                        {notifications.length > 0 ? (
                                            notifications.map((notif) => (
                                                <div
                                                    key={notif.ID}
                                                    style={{
                                                        padding: '12px 16px',
                                                        borderBottom: '1px solid #f0f0f0',
                                                        cursor: 'pointer',
                                                        background: notif.IsRead ? 'white' : '#f6ffed'
                                                    }}
                                                    onClick={async () => {
                                                        if (!notif.IsRead) {
                                                            await notificationService.markAsRead(notif.ID);
                                                            markAsRead(notif.ID);
                                                        }
                                                    }}
                                                >
                                                    <div style={{ fontWeight: 500, marginBottom: 4 }}>{notif.Title}</div>
                                                    <div style={{ fontSize: 12, color: '#666' }}>{notif.Message}</div>
                                                    <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>
                                                        {new Date(notif.CreatedAt).toLocaleString('ar-EG')}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>
                                                لا توجد إشعارات جديدة
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            trigger={['click']}
                        >
                            <Badge count={unreadCount} offset={[-5, 5]}>
                                <Button
                                    type="text"
                                    icon={<BellOutlined style={{ fontSize: 20 }} />}
                                />
                            </Badge>
                        </Dropdown>

                        <Dropdown
                            menu={{ items: userMenuItems }}
                            placement="bottomLeft"
                            trigger={['click']}
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                cursor: 'pointer',
                                padding: '8px 16px',
                                borderRadius: 8,
                                border: '1px solid #f0f0f0',
                                background: '#fafafa',
                                transition: 'all 0.3s'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#f5f5f5';
                                    e.currentTarget.style.borderColor = '#d9d9d9';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#fafafa';
                                    e.currentTarget.style.borderColor = '#f0f0f0';
                                }}
                            >
                                <Avatar
                                    size={40}
                                    style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {user?.username?.charAt(0).toUpperCase() || 'A'}
                                </Avatar>
                                <div style={{ textAlign: 'right', lineHeight: 1.4 }}>
                                    <div style={{ fontWeight: 600, fontSize: 14 }}>{user?.username || 'مستخدم'}</div>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {user?.role?.name || 'مدير'}
                                    </Text>
                                </div>
                            </div>
                        </Dropdown>
                    </Space>
                </Header>

                <Content style={{
                    margin: 24,
                    padding: 24,
                    background: '#fff',
                    borderRadius: 8,
                    minHeight: 280
                }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}
