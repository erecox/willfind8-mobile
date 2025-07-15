import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { ChevronLeftIcon, Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { Card } from "@/components/ui/card";
import { Pressable } from "@/components/ui/pressable";
import { SearchBox, SuggestionDropdownList } from "@/components/custom/search-box";
import { router } from "expo-router";
import { Suggestion } from "@/types";
import debounce from 'lodash.debounce';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const debouncedSearch = debounce((text: string) => {
    setDebouncedQuery(text);
  }, 300);

   const handleSearch = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  const onSelect = (item: Suggestion) => {
    //to screen
  };


  return (
    <VStack className="flex-1">
      <Card size="sm">
        <Box className="w-full flex flex-row items-center p-0">
          <Pressable onPress={() => router.back()}>
            <Icon size='2xl' as={ChevronLeftIcon} />
          </Pressable>
          <SearchBox autoFocus value={query} onSearch={handleSearch} className="flex-1" />
        </Box>
      </Card>

      <SuggestionDropdownList
        onSelect={onSelect}
        query={query}
        debouncedQuery={debouncedQuery} />
    </VStack>
  );
}
