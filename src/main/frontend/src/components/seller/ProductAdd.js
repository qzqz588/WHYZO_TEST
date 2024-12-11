import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import "../../css/seller/ProductAdd.css";
import "../../css/common/CommonStyles.css";
import "../../css/variables.css";

function ProductAdd() {
    const [productData, setProductData] = useState({
        name: '',
        price: '',
        discount: '',
        type: '냉장',
        option: '',
        image: null,
        imagePreview: null
    });
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    const fileInputRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
        
        // 기존 URL 객체들 해제
        previewImages.forEach(url => URL.revokeObjectURL(url));
        
        // 이미지 미리보기 생성
        const previews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(previews);
    };

    const handleRemoveImage = (index) => {
        const newImages = [...images];
        const newPreviews = [...previewImages];
        
        // 제거되는 이미지의 URL 객체 해제
        URL.revokeObjectURL(newPreviews[index]);
        
        newImages.splice(index, 1);
        newPreviews.splice(index, 1);
        
        setImages(newImages);
        setPreviewImages(newPreviews);
        
        // 모든 이미지가 삭제된 경우에만 input 초기화
        if (newImages.length === 0) {
            fileInputRef.current.value = '';
        }
        
        // DataTransfer 객체를 사용하여 새로운 FileList 생성
        const dataTransfer = new DataTransfer();
        newImages.forEach(file => {
            dataTransfer.items.add(file);
        });
        
        // input의 files 속성 업데이트
        fileInputRef.current.files = dataTransfer.files;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 필수 입력값 검증
        if (!productData.name.trim()) {
            alert('상품명을 입력해주세요.');
            return;
        }
        
        if (!productData.price) {
            alert('가격을 입력해주세요.');
            return;
        }
        
        if (!productData.type) {
            alert('상품 타입을 선택해주세요.');
            return;
        }
        
        if (!productData.option.trim()) {
            alert('옵션 정보를 입력해주세요.');
            return;
        }
        
        if (images.length === 0) {
            alert('상품 이미지를 등록해주세요.');
            return;
        }

        // 가격과 할인율 유효성 검사
        if (isNaN(productData.price) || productData.price <= 0) {
            alert('유효한 가격을 입력해주세요.');
            return;
        }

        if (productData.discount) {
            if (isNaN(productData.discount) || productData.discount < 0 || productData.discount > 100) {
                alert('할인율은 0에서 100 사이의 숫자여야 합니다.');
                return;
            }
        }

        // FormData 객체 생성
        const formData = new FormData();
        formData.append('name', productData.name);
        formData.append('price', productData.price);
        formData.append('discount', productData.discount || '0');
        formData.append('type', productData.type);
        formData.append('option', productData.option);
        images.forEach((image) => {
            formData.append('images', image);
        });

        try {
            const response = await axios.post('http://localhost:8090/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // multipart/form-data로 설정
                },
            });

            if (response.status === 200) {
                alert('상품이 성공적으로 등록되었습니다.');
                setProductData({
                    name: '',
                    price: '',
                    discount: '',
                    type: '냉장',
                    option: '',
                    image: null,
                    imagePreview: null
                });
                setImages([]);
                setPreviewImages([]);
            } else {
                alert('상품 등록에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('상품 등록 중 오류가 발생했습니다.');
        }
    };

    // 컴포넌트가 언마운트될 때 URL 객체들 정리
    useEffect(() => {
        return () => {
            previewImages.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewImages]);

    return (
        <div className="product-register-container">
            <h2>상품 등록</h2>
            <form onSubmit={handleSubmit} className="product-register-form">
                <div className="form-group">
                    <label>상품명</label>
                    <input
                        type="text"
                        name="name"
                        value={productData.name}
                        onChange={handleInputChange}
                        required
                        autoComplete="off"
                    />
                </div>

                <div className="form-group">
                    <label>가격</label>
                    <input
                        type="number"
                        name="price"
                        value={productData.price}
                        onChange={handleInputChange}
                        required
                        autoComplete="off"
                    />
                </div>

                <div className="form-group">
                    <label>할인율 (%)</label>
                    <input
                        type="number"
                        name="discount"
                        value={productData.discount}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        autoComplete="off"
                    />
                </div>

                <div className="form-group">
                    <label>상품 타입</label>
                    <select
                        name="type"
                        value={productData.type}
                        onChange={handleInputChange}
                    >
                        <option value="냉장">냉장</option>
                        <option value="냉동">냉동</option>
                        <option value="상온">상온</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>옵션 정보</label>
                    <input
                        type="text"
                        name="option"
                        value={productData.option}
                        onChange={handleInputChange}
                        placeholder="예: NEW! 12월 신상품! 7종 (택1)"
                        autoComplete="off"
                    />
                </div>

                <div className="image-upload-section">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                    />
                    
                    <div className="image-preview-container">
                        {previewImages.map((preview, index) => (
                            <div key={index} className="image-preview-item">
                                <img src={preview} alt={`Preview ${index + 1}`} />
                                <button 
                                    type="button" 
                                    onClick={() => handleRemoveImage(index)}
                                    className="remove-image-btn"
                                >
                                    삭제
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" className="submit-button">
                    상품 등록
                </button>
            </form>
        </div>
    );
}

export default ProductAdd; 