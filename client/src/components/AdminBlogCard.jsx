import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/UseAppContext';
import toast from 'react-hot-toast';

const AdminBlogCard = ({ blog }) => {
    const { axios, fetchBlogs } = useAppContext();
    const { title, description, category, image, _id } = blog;
    const navigate = useNavigate();

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            const { data } = await axios.post(`/api/admin/deleteBlog/${_id}`);
            if (data.success) {
                fetchBlogs();
                toast.success("Blog deleted successfully");
                navigate('/myBlog');
            } else {
                toast.error(`Failed to delete: ${data.message}`);
            }
        }
    };

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-teal-50 flex flex-col h-full">
            <img
                onClick={() => navigate(`/blog/${_id}`)}
                src={image}
                alt={title}
                className="w-full object-cover cursor-pointer"
                style={{ height: '180px' }}
            />
            <div className="p-4 flex flex-col flex-grow">
                <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-3 py-1 rounded-full self-start mb-2">
                    {category}
                </span>
                <h5 className="font-bold text-gray-800 text-sm mb-2 leading-snug">
                    {title.length > 60 ? title.slice(0, 60) + '...' : title}
                </h5>
                <p
                    className="text-gray-500 text-xs leading-relaxed flex-grow"
                    dangerouslySetInnerHTML={{
                        __html: description.length > 80 ? description.slice(0, 80) + '...' : description,
                    }}
                />
                <div className="flex gap-2 mt-4">
                    <button
                        onClick={() => navigate(`/editBlog/${_id}`)}
                        className="flex-1 bg-gradient-to-br from-teal-600 to-teal-700 text-white text-sm font-semibold py-2 rounded-lg hover:opacity-90 transition cursor-pointer"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex-1 border border-red-300 text-red-500 text-sm font-semibold py-2 rounded-lg hover:bg-red-50 transition cursor-pointer"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminBlogCard;