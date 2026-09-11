import { Card } from './ui/card';
import { ScrollView } from './ui/scroll-view';
import { Text } from './ui/text';
import { View } from './ui/view';

export default function SheetScreen() {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="p-5 pt-10 pb-24 gap-4"
    >
      <View className="gap-1 mb-2">
        <Text variant="heading" className="text-foreground font-bold text-2xl">
          BNA UI Components
        </Text>
        <Text variant="caption" className="text-muted-foreground text-xs">
          Pre-built components available in your project
        </Text>
      </View>

      <View className="gap-2.5">
        {bnaComponents.map((item, index) => (
          <Card
            key={index}
            className="bg-card border border-border px-4 py-3 rounded-xl flex-row items-center justify-between shadow-sm"
          >
            <Text className="text-foreground font-medium text-base">
              {item}
            </Text>
            <View className="px-2 py-0.5 rounded-full bg-secondary border border-border">
              <Text className="text-[10px] text-secondary-foreground font-semibold">
                BNA UI
              </Text>
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const bnaComponents = [
  '🪗 Accordion',
  '📜 Action Sheet',
  '🚨 Alert',
  '💬 Alert Dialog',
  '🎧 Audio Player',
  '🎙️ Audio Recorder',
  '🌊 Audio Waveform',
  '👤 Avatar',
  '🎯 AvoidKeyboard',
  '🏷️ Badge',
  '📥 BottomSheet',
  '🔘 Button',
  '📸 Camera',
  '🎥 Camera Preview',
  '🃏 Card',
  '🎠 Carousel',
  '☑️ Checkbox',
  '📂 Collapsible',
  '🎨 Color Picker',
  '🔽 Combobox',
  '📅 Date Picker',
  '📁 File Picker',
  '🖼️ Gallery',
  '👋 Hello Wave',
  '⭐ Icon',
  '🖼️ Image',
  '⌨️ Input',
  '🔢 Input OTP',
  '🔗 Link',
  '🎞️ MediaPicker',
  '🌙 Mode Toggle',
  '🚀 Onboarding',
  '🪟 ParallaxScrollView',
  '🎚️ Picker',
  '💭 Popover',
  '📊 Progress',
  '🔘 Radio',
  '📜 ScrollView',
  '🔍 SearchBar',
  '➖ Separator',
  '📤 Share',
  '📄 Sheet',
  '👻 Skeleton',
  '🌀 Spinner',
  '💡 Switch',
  '📋 Table',
  '📑 Tabs',
  '🔤 Text',
  '🔥 Toast',
  '🎚️ Toggle',
  '🎬 Video',
  '🧩 View',
];
