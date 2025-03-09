import * as RadixScroll from "@radix-ui/react-scroll-area";
import styles from "./ScrollArea.module.css";
import classNames from "classnames";
type Props = {
  className?: string;
  children?: React.ReactNode;
} & React.ComponentProps<typeof RadixScroll.ScrollAreaViewport>;

function ScrollArea({ children, className, ...rest }: Props) {
  return (
    <RadixScroll.Root className={styles.scrollArea}>
      <RadixScroll.Viewport
        className={classNames(styles.viewport, className)}
        {...rest}
      >
        {children}
      </RadixScroll.Viewport>
      <RadixScroll.Scrollbar
        className={styles.scrollbar}
        orientation="vertical"
      >
        <RadixScroll.Thumb className={styles.thumb} />
      </RadixScroll.Scrollbar>
      <RadixScroll.Scrollbar
        className={styles.scrollbar}
        orientation="horizontal"
      >
        <RadixScroll.Thumb className={styles.thumb} />
      </RadixScroll.Scrollbar>
    </RadixScroll.Root>
  );
}

export default ScrollArea;
