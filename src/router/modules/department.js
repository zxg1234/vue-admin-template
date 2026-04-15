import Layout from '@/layout'

export default {
    path: '/department',
    component: Layout,
    children: [
        {
            path: '',
            component: () => import('@/views/department'),
            name: 'department',
            meta: { title: '组织', icon: 'tree' }
        }
    ]
}