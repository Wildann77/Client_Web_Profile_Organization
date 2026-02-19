import { useEffect } from 'react';
import { useSetting } from '@/features/settings/hooks/useSettings';

export function DynamicMetadata() {
    const siteName = useSetting('site_name');
    const siteLogo = useSetting('site_logo');

    useEffect(() => {
        // Update Document Title
        if (siteName) {
            document.title = siteName;
        }

        // Update Favicon
        if (siteLogo) {
            let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.getElementsByTagName('head')[0].appendChild(link);
            }
            link.href = siteLogo;
        }
    }, [siteName, siteLogo]);

    return null; // This component doesn't render anything visual
}
