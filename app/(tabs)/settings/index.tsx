import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/useColor';
import { useRouter } from 'expo-router';
import { Code, Eye, LogOut, Palette, Settings, Activity, ChevronRight } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const primary = useColor('primary');

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-6 pt-24 pb-12 items-center px-4"
    >
      <View className="items-center gap-2">
        <ModeToggle />
        <Text className="text-xs text-muted-foreground mt-1">
          Toggle Light / Dark Mode
        </Text>
      </View>

      <View className="w-full max-w-md gap-4">
        <Text
          variant="title"
          className="text-center font-bold text-foreground text-2xl"
        >
          BNA UI & Settings
        </Text>

        {/* ── Medical Profile Quick Access ── */}
        <TouchableOpacity
          onPress={() => router.push('/medical-conditions')}
          activeOpacity={0.7}
        >
          <Card className="bg-card border border-border/40 p-4 rounded-2xl flex-row items-center justify-between">
            <View className="flex-row items-center gap-3 flex-1 mr-2">
              <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center">
                <Icon name={Activity} size={20} color={primary} />
              </View>
              <View className="flex-1">
                <Text
                  variant="subheading"
                  className="font-semibold text-foreground mb-0.5"
                >
                  Medical Conditions & Diseases
                </Text>
                <Text variant="caption" className="text-muted-foreground leading-relaxed">
                  Manage diagnosed diseases, severity & notes
                </Text>
              </View>
            </View>
            <Icon name={ChevronRight} size={18} color="#8e8e93" />
          </Card>
        </TouchableOpacity>

        <View className="gap-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-card border border-border/40 p-4 rounded-2xl flex-row items-start gap-3"
            >
              <View className="w-10 h-10 rounded-xl bg-secondary items-center justify-center border border-border">
                <Icon name={feature.icon} size={20} color={primary} />
              </View>

              <View className="flex-1">
                <Text
                  variant="body"
                  className="font-semibold text-foreground text-base mb-1"
                >
                  {feature.title}
                </Text>
                <Text variant="caption" className="text-muted-foreground text-xs leading-relaxed">
                  {feature.description}
                </Text>
              </View>
            </Card>
          ))}
        </View>

        <Button
          variant="outline"
          onPress={() => router.replace('/(auth)/login')}
          className="w-full mt-2 border-border"
          style={{ borderRadius: 999 }}
        >
          <View className="flex-row items-center justify-center gap-2">
            <Icon name={LogOut} size={18} />
            <Text className="text-sm font-semibold text-foreground">
              Sign Out to Login
            </Text>
          </View>
        </Button>
      </View>
    </ScrollView>
  );
}

const features = [
  {
    title: 'Live Preview',
    description: 'See components in action with real-time demos',
    icon: Eye,
  },
  {
    title: 'Code Examples',
    description: 'Copy-paste ready code snippets',
    icon: Code,
  },
  {
    title: 'Customizable',
    description: 'Easy to customize with your brand colors',
    icon: Palette,
  },
  {
    title: 'Accessible',
    description: 'Built with accessibility in mind',
    icon: Settings,
  },
];
