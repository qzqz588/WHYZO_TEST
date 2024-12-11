import { Route, Routes } from 'react-router-dom';
import ProductAdd from '../seller/ProductAdd';
import ProductList from '../common/ProductList';
import ProductDetail from '../common/ProductDetail'; 


function ProductRoutes() {
    return (
        <Routes>
            <Route path='/add' element={<ProductAdd/>}/>
            <Route path='/list' element={<ProductList/>}/>
            <Route path='/:id' element={<ProductDetail/>}/>
        </Routes>
    );
}

export default ProductRoutes; 