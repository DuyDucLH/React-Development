import { useEffect, useState } from 'react';
import { Alert, Button, Col, Form } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ProductEdit() {

	const { productId } = useParams();

	const [categories, setCategories] = useState([]);
	const [product, setProduct] = useState();
	const [messages, setMessages] = useState([]);
	const [isUpdate, setIsUpdate] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		axios.get('http://localhost:9999/categories')
			.then(res => setCategories(res.data))
			.catch(err => console.log(err));
		axios.get('http://localhost:9999/products/' + productId)
			.then(res => setProduct(res.data))
			.catch(err => console.log(err));
	}, []);

	function handleChange(e) {
		setProduct({
			...product,
			[e.target.name]: e.target.value
		});
		setIsUpdate(true);
	}

	const handleUpdate = (e) => {
		e.preventDefault();
		axios.patch('http://localhost:9999/products/' + productId, {
			name: product.name,
			price: parseInt(product.price),
			categoryId: parseInt(product.categoryId)
		})
			.then(res => {
				console.log(res.status)
				if (res.status === 200) {
					console.log('done');
					setMessages(['Update product successful'])
					setTimeout(() => {
						navigate('/products');
					}, 1000);
				}
			})
			.catch(err => console.log(err));
	}

	return (
		<Col>
			<h2>Edit product</h2>
			<p>
				<Link to="/products" className='btn btn-danger'>Back to product list</Link>
			</p>
			{messages.length > 0 && <Alert variant='success'>{messages[0]}</Alert>}
			{product &&
				<Form onSubmit={handleUpdate}>
					<Form.Group>
						<Form.Label>ID</Form.Label>
						<Form.Control type="text" value={productId} disabled />
					</Form.Group>
					<Form.Group>
						<Form.Label>Name</Form.Label>
						<Form.Control type="text" name='name' value={product.name} onChange={handleChange} />
					</Form.Group>
					<br />
					<Form.Group>
						<Form.Label>Price</Form.Label>
						<Form.Control type="number" name='price' value={product.price} onChange={handleChange} />
					</Form.Group>
					<br />
					<Form.Group>
						<Form.Label>Category</Form.Label>
						<Form.Control as='select' name='categoryId' defaultValue={product.categoryId} onChange={handleChange}>
							<option value='default' disabled>-- Select a category --</option>
							{
								categories.map((category) => (
									<option key={category.id} value={category.id}>{category.name}</option>
								))
							}
						</Form.Control>
					</Form.Group>
					<br />
					<Button variant="primary" type="submit" disabled={!isUpdate}>Update</Button>
				</Form>
			}
		</Col>
	);
};