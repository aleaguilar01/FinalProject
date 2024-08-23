import React, { useState } from "react";
import { Select, Space, Image, Typography, Flex } from "antd";
import axios from "axios";
import BookModal from "./BookModal";
const noImage = new URL("../../no-image.png", import.meta.url).href; 
let timeout: ReturnType<typeof setTimeout> | null;
let currentValue: string;

const { Text } = Typography
const fetch = (
  value: string,
  callback: (data: { value: string; text: string }[]) => void
) => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  const backendCall = () => {
    const url = encodeURI(`http://localhost:3000/book/${value}`);
    axios(url).then((result: any) => {
      if (currentValue === value) {
        const { data } = result;
        console.log(data)
        const mapdata = data
          .filter((item) => !!item.author && item.isbn && item.isbn.length > 0)
          .map((item: any) => ({
            author: item.author.join(", "),
            cover: item.cover_url,
            value: item.isbn,
            title: item.title,
            published_year: item.published_year,
            publisher: item.publisher,
            number_of_pages: item.number_of_pages,
            first_sentence: item.first_sentence,
            ratings: item.ratings
          }));
        callback(mapdata);
      }
    });
  };
  if (value) {
    timeout = setTimeout(backendCall, 500 );
  } else {
    callback([]);
  }
};

const SearchBar: React.FC<{
  placeholder: string;
  style: React.CSSProperties;
}> = (props) => {
  const [data, setData] = useState([]);
  const [value, setValue] = useState<any>();

  const handleSearch = (newValue: string) => {
    fetch(newValue, setData);
  };

  const handleChange = (isbn: string) => {
    setValue(data.filter((book) => book.value === isbn)[0]);
  };

  return (
    <>
      <Select
        value={value}
        showSearch
        placeholder={props.placeholder}
        style={props.style}
        defaultActiveFirstOption={false}
        suffixIcon={null}
        filterOption={false}
        onSearch={handleSearch}
        onChange={handleChange}
        notFoundContent={null}
        options={data}
        optionRender={(option: any) => (
          <Space>
            <Image height={84}  src={option.data.cover || noImage} preview={false} />
            <Flex vertical style={{width: 300}}>
            <Text strong style={{ textWrap: "wrap" }}>{option.data.title}</Text>
            <Text italic>{option.data.author}</Text>
            </Flex>
            {option.data.isbn}
          </Space>
        )}
      />
      <BookModal value={value} setValue={setValue} />
    </>
  );
};

export default SearchBar;