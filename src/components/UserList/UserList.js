import React, { useEffect, useMemo, useState } from "react";
import Text from "components/Text";
import Spinner from "components/Spinner";
import CheckBox from "components/CheckBox";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import * as S from "./style";

const UserList = ({ users, isLoading, onFetch }) => {
  const [hoveredUserId, setHoveredUserId] = useState();
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites") || "[]")
  );
  const [allUsers, setAllUsers] = useState([]);

  const handleMouseEnter = (index) => {
    setHoveredUserId(index);
  };

  const handleMouseLeave = () => {
    setHoveredUserId();
  };

  const handleCheckBoxChange = (isChecked, label) => {
    setSelectedCountries((prev) =>
      isChecked ? [...prev, label] : prev.filter((country) => country !== label)
    );
  };

  const countriesFiltered = [
    {
      label: "Brazil",
      value: "BR",
    },
    {
      label: "Australia",
      value: "AU",
    },
    {
      label: "Canada",
      value: "CA",
    },
    {
      label: "Germany",
      value: "DE",
    },
    {
      label: "Other",
      value: "OT",
    },
  ];
  const checkBoxElements = countriesFiltered.map((item, index) => (
    <CheckBox
      key={index}
      value={item.value}
      label={item.label}
      onChange={handleCheckBoxChange}
    />
  ));

  const isInSelectedCountries = (country) => {
    return selectedCountries.indexOf(country) >= 0;
  };

  const isInCountries = (country) => {
    return Boolean(countriesFiltered.find((item) => item.label === country));
  };

  const isInFavorites = (user) => {
    return Boolean(favorites.find((item) => item.email === user.email));
  };

  const handleFavClick = (user) => {
    if (isInFavorites(user)) {
      setFavorites((prevList) =>
        prevList.filter((userItem) => userItem.email !== user.email)
      );
    } else {
      setFavorites((prevList) => [...prevList, user]);
    }
  };

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
    setAllUsers((prevList) => [...prevList, ...users]);
  }, [favorites, users]);

  const PRECISION = 0.5;
  const handleScroll = (e) => {
    const diff = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight;
    if (Math.abs(diff) <= PRECISION) {
      onFetch();
    }
  };

  return (
    <S.UserList>
      <S.Filters>{checkBoxElements}</S.Filters>
      <S.List onScroll={handleScroll}>
        {allUsers
          .filter(
            (user) =>
              isInSelectedCountries(user.location.country) ||
              (isInSelectedCountries("Other") && !isInCountries(user.location.country))
          )
          .map((user, index) => {
            return (
              <S.User
                key={index}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <S.UserPicture src={user?.picture.large} alt="" />
                <S.UserInfo>
                  <Text size="22px" bold>
                    {user?.name.title} {user?.name.first} {user?.name.last}
                  </Text>
                  <Text size="14px">{user?.email}</Text>
                  <Text size="14px">
                    {user?.location.street.number} {user?.location.street.name}
                  </Text>
                  <Text size="14px">
                    {user?.location.city} {user?.location.country}
                  </Text>
                </S.UserInfo>
                <S.IconButtonWrapper
                  isVisible={index === hoveredUserId || isInFavorites(user)}
                  onClick={() => {
                    handleFavClick(user);
                  }}
                >
                  <IconButton>
                    <FavoriteIcon color="error" />
                  </IconButton>
                </S.IconButtonWrapper>
              </S.User>
            );
          })}
        {isLoading && (
          <S.SpinnerWrapper>
            <Spinner color="primary" size="45px" thickness={6} variant="indeterminate" />
          </S.SpinnerWrapper>
        )}
      </S.List>
    </S.UserList>
  );
};

export default UserList;
