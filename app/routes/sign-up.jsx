import { Form, useActionData, json, useTransition } from 'remix';
import { createUser } from '~/utils/auth';
import Layout from '~/components/layout';

export async function action({ request }) {
    const errors = {};
    try {
        const form = await request.formData();
        const firstName = form.get('firstName');
        const lastName = form.get('lastName');
        const email = form.get('email');
        const password = form.get('password');
        const phoneNumber = form.get('phoneNumber');

        // validate the fields
        if (!firstName) {
            errors.firstName = 'First name is required';
        }
        if (!lastName) {
            errors.lastName = 'Last name is required';
        }
        if (!email || !email.match(/^\S+@\S+$/)) {
            errors.email = 'Email address is invalid';
        }

        if (!password || password.length < 6) {
            errors.password = 'Password must be > 6 characters';
        }

        if (!phoneNumber || !phoneNumber.match(/^\D*(\d\D*){9,14}$/)) {
            errors.phoneNumber = 'Phone number is invalid';
        }

        // return data if we have errors
        if (Object.keys(errors).length) {
            return json({ errors }, { status: 422 });
        }

        const { user, error } = createUser({ email, password, firstName, lastName, phoneNumber });

        if (user?.status === 201) {
            return json({ user }, { status: 200 });
        }
        throw error;
    } catch (error) {
        console.log('error', error);
        errors.server = error?.message || error;
        return json({ errors }, { status: 500 });
    }
}

const SignUp = () => {
    const data = useActionData();
    const transition = useTransition();
    return (
        <Layout>
            <h2 className='text-3xl font-light'>
                Sign <strong className='font-bold'>up</strong>
            </h2>
            <Form method='post' className='my-3'>
                {data?.user && (
                    <div
                        className='mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative'
                        role='alert'
                    >
                        <strong className='font-bold'>Congrats! </strong>
                        <span className='block sm:inline'>
                            Your account has been registered. Please go to your email for confirmation instructions.
                        </span>
                    </div>
                )}
                <div className='mb-2'>
                    <label className='text-gray-700 text-sm font-bold mb-2' htmlFor='firstName'>
                        First name
                    </label>
                    <input
                        id='firstName'
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        type='text'
                        placeholder='Your first name'
                        name='firstName'
                    />
                    {data?.errors?.firstName ? (
                        <p className='text-red-500 text-xs italic'>{data?.errors.firstName}</p>
                    ) : null}
                </div>
                <div className='mb-2'>
                    <label className='text-gray-700 text-sm font-bold mb-2' htmlFor='lastName'>
                        Last name
                    </label>
                    <input
                        id='lastName'
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        type='text'
                        placeholder='Your last name'
                        name='lastName'
                    />
                    {data?.errors?.lastName ? (
                        <p className='text-red-500 text-xs italic'>{data?.errors.lastName}</p>
                    ) : null}
                </div>
                <div className='mb-2'>
                    <label className='text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
                        Email
                    </label>
                    <input
                        id='email'
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        type='email'
                        placeholder='Your email'
                        name='email'
                    />
                    {data?.errors?.email ? <p className='text-red-500 text-xs italic'>{data?.errors.email}</p> : null}
                </div>
                <div className='mb-2'>
                    <label className='text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
                        Password
                    </label>
                    <input
                        id='password'
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        type='password'
                        name='password'
                        placeholder='Your password'
                    />
                    {data?.errors?.password ? (
                        <p className='text-red-500 text-xs italic'>{data?.errors.password}</p>
                    ) : null}
                </div>
                <div className='mb-2'>
                    <label className='text-gray-700 text-sm font-bold mb-2' htmlFor='phoneNumber'>
                        Phone Number
                    </label>
                    <input
                        id='phoneNumber'
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        type='text'
                        placeholder='Your phone number'
                        name='phoneNumber'
                    />
                    {data?.errors?.phoneNumber ? (
                        <p className='text-red-500 text-xs italic'>{data?.errors.phoneNumber}</p>
                    ) : null}
                </div>
                <div>
                    <button
                        type='submit'
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3'
                        aria-live='polite'
                        disabled={transition.state !== 'idle'}
                    >
                        {transition.state !== 'idle' ? 'Loading...' : 'Sign up'}
                    </button>
                    {data?.errors?.server ? <p className='text-red-500 text-xs italic'>{data?.errors.server}</p> : null}
                </div>
            </Form>
        </Layout>
    );
};

export default SignUp;
