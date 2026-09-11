import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useSearch } from '@/providers/search-context';
import { Search as SearchIcon, Sparkles } from 'lucide-react-native';
import { useState } from 'react';

const sampleComponents = [
  { name: 'Button', category: 'General', desc: 'Interactive pressable button with variants' },
  { name: 'Card', category: 'Layout', desc: 'Container card with header, content, and footer' },
  { name: 'Input', category: 'Forms', desc: 'Styled text input with icons and states' },
  { name: 'Tabs', category: 'Navigation', desc: 'Animated swipeable tabs component' },
  { name: 'Icon', category: 'Media', desc: 'Themed Lucide icon wrapper' },
  { name: 'ScrollView', category: 'Layout', desc: 'Scrollable container with NativeWind styling' },
  { name: 'ModeToggle', category: 'Theme', desc: 'Toggle between light and dark themes' },
];

export default function SearchScreen() {
  const { searchText } = useSearch();
  const [query, setQuery] = useState(searchText || '');

  const effectiveQuery = searchText || query;
  const filtered = sampleComponents.filter((item) =>
    item.name.toLowerCase().includes(effectiveQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(effectiveQuery.toLowerCase())
  );

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-5 pt-16 gap-5"
    >
      <View className="gap-2">
        <Text
          variant="heading"
          className="text-center font-bold text-foreground text-3xl"
        >
          Search Components
        </Text>
        <Text
          variant="caption"
          className="text-center text-muted-foreground text-sm"
        >
          Instant search across BNA UI library
        </Text>
      </View>

      <View className="w-full">
        <Input
          placeholder="Search components..."
          value={effectiveQuery}
          onChangeText={setQuery}
          icon={SearchIcon}
          className="w-full"
          containerStyle={{
            borderRadius: 999,
            backgroundColor: '#ffffff',
            borderWidth: 0,
          }}
        />
      </View>

      <View className="gap-3 mt-2">
        <View className="flex-row items-center justify-between px-1">
          <Text className="text-xs font-semibold text-muted-foreground">
            Available components ({filtered.length})
          </Text>
        </View>

        {filtered.map((item, idx) => (
          <Card
            key={idx}
            className="bg-card border border-border p-4 rounded-xl flex-row items-center justify-between shadow-sm"
          >
            <View className="gap-1 flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-base font-semibold text-foreground">
                  {item.name}
                </Text>
                <View className="px-2 py-0.5 rounded-full bg-secondary border border-border">
                  <Text className="text-[10px] font-medium text-secondary-foreground">
                    {item.category}
                  </Text>
                </View>
              </View>
              <Text variant="caption" className="text-muted-foreground text-xs">
                {item.desc}
              </Text>
            </View>
            <View className="w-8 h-8 rounded-full bg-secondary items-center justify-center border border-border">
              <Icon name={Sparkles} size={14} />
            </View>
          </Card>
        ))}

        {filtered.length === 0 && (
          <Card className="bg-card border border-border p-8 rounded-xl items-center justify-center">
            <Text className="text-muted-foreground text-sm text-center">
              No matching components found for &quot;{effectiveQuery}&quot;
            </Text>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}
