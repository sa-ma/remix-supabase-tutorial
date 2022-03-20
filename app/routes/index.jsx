import { redirect, useLoaderData, json } from 'remix';
import Layout from '~/components/layout';
import { getUserData, isAuthenticated } from '~/utils/auth';

export const loader = async ({ request }) => {
    let errors = {};
    try {
        const userAuthenticated = await isAuthenticated(request, true);
        if (!userAuthenticated) {
            return redirect('/sign-in');
        }
        const { user } = userAuthenticated;
        const { data, error } = await getUserData(user?.id);
        if (data) {
            console.log('here')
            return json({ user: { ...data, email: user?.email } }, { status: 200 });
        }
        throw error;
    } catch (error) {
        console.log('error', error);
        errors.server = error?.message || error;
        return json({ errors }, { status: 500 });
    }
};


const Index = () => {
    const data = useLoaderData();
    return (
        <Layout showSignOut={true}>
            <h2 className='text-3xl font-light'>
                Welcome <strong className='font-bold'>{data?.user?.first_name}</strong>,
            </h2>
            <section className='max-w-sm w-full lg:max-w-full my-6'>
                <div className='mb-2'>
                    <p className='text-gray-700 text-sm font-bold'>Full name</p>
                    <p>{`${data?.user?.first_name} ${data?.user?.last_name}`}</p>
                </div>
                <div className='mb-2'>
                    <p className='text-gray-700 text-sm font-bold'>Email</p>
                    <p>{data?.user?.email}</p>
                </div>

                <div className='mb-2'>
                    <p className='text-gray-700 text-sm font-bold'>Phone Number</p>
                    <p>{data?.user?.phone_number}</p>
                </div>
            </section>
        </Layout>
    );
};

export default Index;
