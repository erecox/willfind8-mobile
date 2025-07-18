import { ClockIcon, Icon, SearchIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon } from "@/components/ui/input";
import React from "react";
import { Box } from "@/components/ui/box";
import { Suggestion } from "@/types";
import { HStack } from "@/components/ui/hstack";
import { HighlightText } from "@/components/ui/highlight-text";
import { Card } from "@/components/ui/card";
import { ActivityIndicator, FlatList } from "react-native";
import { Divider } from "@/components/ui/divider";
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions";
import { Pressable } from "@/components/ui/pressable";
import { ArrowUpRight } from "lucide-react-native";
import { useRecentSearch } from "@/hooks/useRecentSearch";

interface SearchBoxProps {
    className?: string;
    autoFocus?: boolean;
    placeholder?: string;
    value?: string;
    onSearch?: (text: string) => void;
    onFocus?: () => void;
}

export function SearchBox({
    className, autoFocus, value, placeholder = 'Search...',
    onFocus, onSearch }: SearchBoxProps) {

    return (
        <Box className={className}>
            <Input variant="outline"
                className={`px-1 w-full border-gray-300 dark:border-gray-500 rounded-xl bg-gray-50 dark:bg-gray-400 ${className}`} >
                <InputIcon as={SearchIcon} />
                <InputField
                    value={value}
                    autoFocus={autoFocus}
                    aria-disabled={true}
                    onChangeText={onSearch}
                    onPress={onFocus}
                    placeholder={placeholder} />
            </Input>
        </Box>
    )
};

interface SuggestionItemProps {
    suggestion: Suggestion
    query: string;
    isRecent?: boolean;
    onPress?: () => void;
}

export function SuggestionItem({ suggestion, query, isRecent, onPress }: SuggestionItemProps) {

    return (
        <Pressable onPress={onPress} className="py-2">
            <HStack className="justify-between items-center">
                <HighlightText query={query} text={suggestion.keyword} />
                <Icon color="gray" as={isRecent ? ClockIcon : ArrowUpRight} />
            </HStack>
        </Pressable>
    )
}

interface SuggestionDropdownListProps {
    debouncedQuery: string;
    query: string;
    className?: string;
    onSelect?: (item: Suggestion) => void;
}

export function SuggestionDropdownList({ debouncedQuery, query, className, onSelect }: SuggestionDropdownListProps) {
    const { data = [], isFetching } = useSearchSuggestions(debouncedQuery);
    const { recentSearches, addRecent } = useRecentSearch();
    const suggestions = [...recentSearches.filter((item) => item.keyword.toLowerCase().includes(query)), ...data];

    const handleSelection = (item: Suggestion) => {
        addRecent({ ...item, is_recent: true });
        if (onSelect) onSelect(item);
    }

    const renderSuggestionItem = ({ item }: { item: Suggestion }) => (
        <SuggestionItem
            onPress={() => handleSelection(item)}
            query={query}
            suggestion={item}
            isRecent={item.is_recent} />
    );

    return (isFetching || suggestions.length ?
        <Card size="sm" className={`absolute z-1000 w-full ${className}`}>
            <FlatList<Suggestion>
                data={suggestions}
                renderItem={renderSuggestionItem}
                extraData={[query]}
                keyExtractor={(item, i) => (item.id + i).toString()}
                ItemSeparatorComponent={() => <Divider />}
                ListFooterComponent={() => (isFetching &&
                    <Box className="p-1"><ActivityIndicator animating /></Box>)}
            />
        </Card> : <></>
    )
}