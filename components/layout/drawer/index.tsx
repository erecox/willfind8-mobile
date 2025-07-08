import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import { Slot, usePathname } from "expo-router";
import { Platform, View } from "react-native";

export function WebSidebarLayout() {

    const pathname = usePathname();

    if (Platform.OS !== 'web') return;

    return (
        <View style={{ flexDirection: 'row', flex: 1 }}>
            {/* Sidebar */}
            <View style={{ width: 200, backgroundColor: '#eee', padding: 20 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Navigation</Text>
                <Link href="/home" style={{ marginBottom: 10, color: pathname === '/home' ? 'blue' : 'black' }}>Home</Link>
                <Link href="/profile" style={{ color: pathname === '/profile' ? 'blue' : 'black' }}>Profile</Link>
            </View>

            {/* Screen Content */}
            <View style={{ flex: 1 }}>
                <Slot />
            </View>
        </View>
    );
}
